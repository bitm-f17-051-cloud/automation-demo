/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useMemo } from "react";

type TriggerOption = {
  value: string;
  label: string;
  category?: string;
  icon?: React.ComponentType<any>;
  description?: string;
};

interface TriggerSelectorProps {
  triggers: TriggerOption[];
  selectedTrigger: string;
  onChange: (value: string) => void;
  className?: string;
}

const TriggerSelector = ({
  triggers,
  selectedTrigger,
  onChange,
  className,
}: TriggerSelectorProps) => {
  const grouped = useMemo(() => {
    return triggers.reduce<Record<string, TriggerOption[]>>((acc, trigger) => {
      const key = trigger.category || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(trigger);
      return acc;
    }, {});
  }, [triggers]);

  const current = triggers.find((trigger) => trigger.value === selectedTrigger);

  return (
    <div
      className={cn(
        "border-b border-gray-200 bg-white px-6 py-5 space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Add Trigger
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
            {current?.label || "Workflow Trigger"}
          </h2>
          {current?.value && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs text-gray-400">Slug:</span>
              <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {current.value}
              </code>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Adds a workflow trigger, and on execution, the workflow starts from
            this trigger.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Info className="w-4 h-4" />
          Learn More
        </Button>
      </div>

      <div className="space-y-3 w-full">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Choose a workflow trigger
          </label>
          <Select
            value={selectedTrigger}
            onValueChange={onChange}
          >
            <SelectTrigger className="h-10 text-left w-full">
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent className="max-h-auto mt-4 w-full">
              {Object.entries(grouped).map(([category, options]) => (
                <div key={category}>
                  <p className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {category}
                  </p>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon && (
                          <option.icon className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-900">
                          {option.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
      </div>
    </div>
  );
};

export default TriggerSelector;

