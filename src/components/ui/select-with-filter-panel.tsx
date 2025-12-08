import { useFilterTypeSelector } from "@/contexts/filter-type-selector-context";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectWithFilterPanelProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SelectWithFilterPanel = ({
  value,
  onValueChange,
  placeholder = "Select filter type",
  className,
}: SelectWithFilterPanelProps) => {
  const { openPanel } = useFilterTypeSelector();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      openPanel(onValueChange);
    }, 0);
  };

  // Format the display value - show the last part of nested fields (e.g., "contacts.name" -> "name")
  const displayValue = value ? value.split('.').pop() || value : placeholder;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <span className={cn("text-left font-mono text-xs", !value && "text-muted-foreground")}>
        {displayValue}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

