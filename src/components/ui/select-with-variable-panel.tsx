import { useVariableSelector } from "@/contexts/variable-selector-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectWithVariablePanelProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  variableOptions?: Array<{ value: string; label: string }>;
  triggerContent?: React.ReactNode;
  displayValue?: string;
};

export const SelectWithVariablePanel = ({
  value,
  onValueChange,
  placeholder = "Select or map a field",
  className,
  children,
  variableOptions = [],
  triggerContent,
  displayValue,
}: SelectWithVariablePanelProps) => {
  const { openPanel } = useVariableSelector();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      openPanel(onValueChange);
    }, 0);
  };

  const displayText = displayValue || value || placeholder;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <span className={cn("text-left flex-1", !value && "text-muted-foreground")}>
        {displayText}
      </span>
      <div className="flex items-center gap-2">
        {triggerContent}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    </button>
  );
};

