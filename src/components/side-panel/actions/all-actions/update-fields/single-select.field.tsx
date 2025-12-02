import { ObjectField } from "@/app/api/objects/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SingleSelectFieldOptionsProps = {
  field: ObjectField | null;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
}

const SingleSelectFieldOptions = ({ field, selectedOption, setSelectedOption }: SingleSelectFieldOptionsProps) => {
  if (!field) return null;

  return (
    <Select value={selectedOption ?? undefined} onValueChange={setSelectedOption}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {field.CustomFieldOptions?.map((option) => (
          <SelectItem key={option.id} value={option.name}>
            {option.color && <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: option.color }} />}
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SingleSelectFieldOptions;