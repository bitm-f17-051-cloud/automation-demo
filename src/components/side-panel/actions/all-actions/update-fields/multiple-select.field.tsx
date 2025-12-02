import { ObjectField } from "@/app/api/objects/route";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PrimaryButton from "@/components/ui/primary-button";
import { ChevronDownIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type MultipleSelectFieldOptionsProps = {
  field: ObjectField | null;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
};

const MultipleSelectFieldOptions = ({
  field,
  selectedOptions,
  setSelectedOptions,
}: MultipleSelectFieldOptionsProps) => {
  if (!field) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <PrimaryButton
          isPrimary={false}
          className={`w-full flex !text-sm items-center justify-between border-input rounded-md ${
            selectedOptions.length === 0 ? "!text-muted-foreground" : ""
          }`}
        >
          {selectedOptions.length > 0
            ? `${selectedOptions.length} options selected`
            : "Select"}
          <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
        </PrimaryButton>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[calc(30dvw-32px)] mr-4">
        <div className="p-2">
          <div className="max-h-48 overflow-y-auto">
            {field.CustomFieldOptions?.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50"
              >
                <Checkbox
                  className="cursor-pointer"
                  checked={selectedOptions.includes(option.name)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedOptions([
                          ...selectedOptions,
                          option.name,
                        ])
                      : setSelectedOptions(
                          selectedOptions?.filter(
                            (value) => value !== option.name
                          )
                        );
                  }}
                />

                <div className="flex items-center gap-2">
                  {option.color && <div
                    className={`w-2.5 h-2.5 rounded-full`}
                    style={{ backgroundColor: option.color ?? undefined }}
                  />}
                  {option.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultipleSelectFieldOptions;
