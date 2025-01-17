import Icon from "@/components/icon/index.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useState} from "react";
import {IconName} from "@/types/icon";

type Colors = "black" | "white" | "gray" | "red" | "green" | "blue" | undefined

export const iconNames: Record<string, IconName>[] = [
  {key: "hand-index", label: "hand-index"},
  {key: "hand-index-fill", label: "hand-index-fill"},
  {key: "hand-index-thumb", label: "hand-index-thumb"},
  {key: "hand-index-thumb-fill", label: "hand-index-thumb-fill"},
  {key: "hand-thumbs-down", label: "hand-thumbs-down"},
  {key: "hand-thumbs-down-fill", label: "hand-thumbs-down-fill"},
  {key: "hand-thumbs-up", label: "hand-thumbs-up"},
  {key: "hand-thumbs-up-fill", label: "hand-thumbs-up-fill"},
];
export const colors: Record<string, Colors>[] = [
  {key: "black", label: "black"},
  {key: "white", label: "white"},
  {key: "gray", label: "gray"},
  {key: "red", label: "red"},
  {key: "green", label: "green"},
  {key: "blue", label: "blue"},
];

function App() {
  const [iconName, setIconName] = useState<IconName>(iconNames[0].label);
  const [color, setColor] = useState<Colors>(colors[0].label);

  return <div className="mx-auto gap-12 w-full max-w-[768px] flex flex-col items-center justify-center">
    <Select onValueChange={(value) => setIconName(value as IconName)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Icon name" />
      </SelectTrigger>
      <SelectContent>
        {iconNames.map(iconName => <SelectItem value={iconName.key}>{iconName.label}</SelectItem>)}
      </SelectContent>
    </Select>
    <Select onValueChange={(value) => setColor(value as Colors)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map(iconName => <SelectItem value={iconName.key}>{iconName.label}</SelectItem>)}
      </SelectContent>
    </Select>
    <div className='self-stretch flex justify-center'>
      <Icon name={iconName} color={color} />
    </div>
  </div>
}

export default App
