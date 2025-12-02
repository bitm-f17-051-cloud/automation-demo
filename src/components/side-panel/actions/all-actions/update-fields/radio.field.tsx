import { ObjectField } from "@/app/api/objects/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RadioFieldOptionsProps = {
  field: ObjectField | null;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

const RadioFieldOptions = ({ field, selectedOption, setSelectedOption }: RadioFieldOptionsProps) => {
  if (!field) return null;

  return (
    <Select value={selectedOption ?? undefined} onValueChange={setSelectedOption}>
      <SelectTrigger className="w-full capitalize">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {field.CustomFieldOptions?.map((option) => (
          <SelectItem type="radio" key={option.id} value={option.name} className="capitalize flex items-center gap-2">
            {option.color && <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: option.color }} />}
            {option.icon && <div className="w-4 h-4 mr-1">{option.icon}</div>}
            {option.name.toLowerCase().split("_").join(" ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default RadioFieldOptions;