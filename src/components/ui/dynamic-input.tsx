import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

// Trigger output fields structure (same as in filters)
const TRIGGER_OUTPUT_FIELDS = {
  root: {
    id: "Root.id",
    name: "Root.name",
    email: "Root.email",
    created_at: "Root.created_at",
  },
  contact: {
    id: "contact.id",
    email: "contact.email",
    first_name: "contact.first_name",
    last_name: "contact.last_name",
    phone: "contact.phone",
    full_name: "contact.full_name",
    date_of_birth: "contact.date_of_birth",
    tags: "contact.tags",
  },
  user: {
    id: "user.id",
    name: "user.name",
    email: "user.email",
    phone: "user.phone",
  },
  account: {
    id: "account.id",
    name: "account.name",
  },
};

type DynamicInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
};

export const DynamicInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "h-12",
  disabled = false,
}: DynamicInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const insertVariable = (variable: string) => {
    const currentValue = value || "";
    const cursorPosition = inputRef.current?.selectionStart || currentValue.length;
    const textBefore = currentValue.substring(0, cursorPosition);
    const textAfter = currentValue.substring(cursorPosition);
    const newValue = `${textBefore}{{${variable}}}${textAfter}`;
    onChange(newValue);
    setIsOpen(false);

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="relative flex gap-1">
      <Input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex-shrink-0 h-12 px-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={disabled}
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="max-h-[400px] overflow-y-auto">
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <p className="text-xs font-semibold text-gray-700">Insert Variable</p>
            </div>

            {/* Trigger Fields */}
            <div className="p-2">
              <div className="text-xs font-bold text-gray-900 mb-2 px-2">Trigger Output</div>
              
              {/* Root fields */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded">
                  Root
                </div>
                {Object.entries(TRIGGER_OUTPUT_FIELDS.root).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => insertVariable(value)}
                    className="w-full text-left px-2 py-1.5 text-xs font-mono text-gray-700 hover:bg-blue-50 rounded transition-colors pl-6"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Contact fields */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded">
                  Contact
                </div>
                {Object.entries(TRIGGER_OUTPUT_FIELDS.contact).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => insertVariable(value)}
                    className="w-full text-left px-2 py-1.5 text-xs font-mono text-gray-700 hover:bg-blue-50 rounded transition-colors pl-6"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* User fields */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded">
                  User
                </div>
                {Object.entries(TRIGGER_OUTPUT_FIELDS.user).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => insertVariable(value)}
                    className="w-full text-left px-2 py-1.5 text-xs font-mono text-gray-700 hover:bg-blue-50 rounded transition-colors pl-6"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Account fields */}
              <div className="mb-2">
                <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded">
                  Account
                </div>
                {Object.entries(TRIGGER_OUTPUT_FIELDS.account).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => insertVariable(value)}
                    className="w-full text-left px-2 py-1.5 text-xs font-mono text-gray-700 hover:bg-blue-50 rounded transition-colors pl-6"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Actions - Placeholder for now */}
            <div className="p-2 border-t border-gray-200">
              <div className="text-xs font-bold text-gray-900 mb-2 px-2">Previous Actions</div>
              <div className="px-2 py-3 text-xs text-gray-500 text-center">
                No previous actions available
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

