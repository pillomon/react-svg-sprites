import { writeFile, readFile } from "node:fs/promises";
import * as path from "node:path";
import * as fsExtra from "fs-extra";
import { glob } from "glob";
import { parse } from "node-html-parser";

const shouldVerboseLog = process.argv.includes("--log=verbose");
const logVerbose = shouldVerboseLog ? console.log : () => {};

/**
 * Export svg file path without .svg extension.
 * @param filePath SVG file path
 */
const iconName = (filePath: string) =>
  filePath.replace(/\.svg$/, "").replace(/\\/g, "/");

/**
 * Compare the contents of originFile and newFile.
 * @param originFilePath
 * @param newFileContents
 */
const checkFileChanged = async (
  originFilePath: string,
  newFileContents: string
) => {
  let originFileContents = "";
  try {
    originFileContents = await readFile(originFilePath, "utf8").catch(() => "");
  } catch (error) {
    console.error(error);
  }
  if (originFileContents === newFileContents) return false;
  await writeFile(originFilePath, newFileContents, "utf8");
  return true;
};

/**
 * Generate sprite svg.
 * @param files SVG files
 * @param inputDir Input directory path for results
 * @param outputPath Output directory path for results
 */
async function generateSprite({
  filePaths,
  inputDir,
  outputPath,
}: {
  filePaths: string[];
  inputDir: string;
  outputPath: string;
}) {
  const symbols = await Promise.all(
    filePaths.map(async (filePath) => {
      const input = await readFile(path.join(inputDir, filePath), "utf8").catch(
        () => ""
      );
      const root = parse(input);

      const svg = root.querySelector("svg");

      if (!svg) throw new Error("No SVG element found");

      svg.tagName = "symbol";
      svg.setAttribute("id", iconName(filePath));
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xmlns:xlink");
      svg.removeAttribute("version");
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      return svg.toString().trim();
    })
  );

  const output = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
    `<defs>`,
    ...symbols,
    `</defs>`,
    `</svg>`,
    "",
  ].join("\n");

  return checkFileChanged(outputPath, output);
}

/**
 * Generate sprite and type declarations.
 * @param filePaths SVG file paths
 */
const generateSpriteAndTypeDeclarations = async (filePaths: string[]) => {
  const spriteFilepath = path.join(outputDir, "sprite.svg");
  const typeDeclarationsOutputFilepath = path.join(typeDir, "icon.d.ts");
  let currentSprite = "";
  let currentTypes = "";
  try {
    [currentSprite, currentTypes] = await Promise.all([
      readFile(spriteFilepath, "utf8").catch(() => ""),
      readFile(typeDeclarationsOutputFilepath, "utf8").catch(() => ""),
    ]);
  } catch (error) {
    console.error(error);
  }

  const iconNames = filePaths.map((filePath) => iconName(filePath));

  const spriteUpToDate = iconNames.every((name) =>
    currentSprite.includes(`id=${name}`)
  );
  const iconTypesUpToDate = iconNames.every((name) =>
    currentTypes.includes(name)
  );

  if (spriteUpToDate && iconTypesUpToDate) {
    logVerbose(`Icons are up to date`);
    return;
  }

  logVerbose(`Generating sprite for ${inputDirRelative}`);

  const spriteChanged = await generateSprite({
    filePaths,
    inputDir,
    outputPath: spriteFilepath,
  });

  for (const filePath of filePaths) {
    logVerbose("✅", filePath);
  }
  logVerbose(`Saved to ${path.relative(cwd, spriteFilepath)}`);

  const stringifiedIconNames = iconNames.map((name) => JSON.stringify(name));

  const typeOutputContent = `export type IconName = \n\t| ${stringifiedIconNames.join(
    "\n\t| "
  )};`;
  const typesChanged = await checkFileChanged(
    typeDeclarationsOutputFilepath,
    typeOutputContent
  );

  logVerbose(
    `Manifest saved to ${path.relative(cwd, typeDeclarationsOutputFilepath)}`
  );

  if (spriteChanged) console.log(`Generated ${filePaths.length} icons`);
  if (typesChanged) console.log(`Generated new type declarations.`);
};

const cwd = process.cwd();
const inputDir = path.join(cwd, "public", 'svg');
const inputDirRelative = path.relative(cwd, inputDir);
const typeDir = path.join(cwd, "src", "types");
const outputDir = path.join(cwd, "public");

/**
 * Check if typeDir and outputDir exist, and create them if they don't exist.
 */
const createDirectories = async () =>
  await Promise.all([
    await fsExtra.ensureDir(typeDir),
    await fsExtra.ensureDir(outputDir),
  ]);
(async () => {
  try {
    await createDirectories();
  } catch (error) {
    console.error(error);
  }
})();

const svgFilePaths = glob
  .sync("**/*.svg", {
    cwd: inputDir,
  })
  .sort((a, b) => a.localeCompare(b));

if (svgFilePaths.length === 0)
  throw new Error(`No SVG files found in ${inputDirRelative}`);
(async () => await generateSpriteAndTypeDeclarations(svgFilePaths))();
