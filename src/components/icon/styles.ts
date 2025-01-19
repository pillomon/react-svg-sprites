import { cva } from "class-variance-authority";

export const iconStyles = cva(["transition-all", "stroke-[0px]"], {
  variants: {
    size: {
      L: ["w-[24px]", "h-[24px]"],
      M: ["w-[20px]", "h-[20px]"],
      S: ["w-[16px]", "h-[16px]"],
    },
    color: {
      black: "text-black",
      white: "text-white",
      gray: "text-gray-500",
      red: "text`-red-500",
      green: "text-green-500",
      blue: "text-blue-500",
    },
  },
  defaultVariants: {
    size: "L",
    color: "black",
  },
});
