import { ObjectField } from "@/app/api/objects/route";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";

type DateFieldOptionsProps = {
  field: ObjectField | null;
  date: Date | null;
  setDate: (date: Date) => void;
  time: string | null;
  setTime: (time: string) => void;  
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DateFieldOptions = ({
  field,
  date,
  setDate,
  time,
  setTime,
  open,
  setOpen,
}: DateFieldOptionsProps) => {
  if (!field) return null;

  return (
    <div className="flex gap-1.5">
      <div className="w-2/3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {date ? new Date(date).toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date ?? new Date());
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-1/3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="09:00:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          value={time ?? undefined}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateFieldOptions;
