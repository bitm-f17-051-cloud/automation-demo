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

type DynamicTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
};

export const DynamicTextarea = ({
  value,
  onChange,
  placeholder,
  minHeight = "100px",
  disabled = false,
}: DynamicTextareaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variable: string) => {
    const currentValue = value || "";
    const cursorPosition = textareaRef.current?.selectionStart || currentValue.length;
    const textBefore = currentValue.substring(0, cursorPosition);
    const textAfter = currentValue.substring(cursorPosition);
    const newValue = `${textBefore}{{${variable}}}${textAfter}`;
    onChange(newValue);
    setIsOpen(false);

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ minHeight }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="flex justify-end">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={disabled}
            >
              <ChevronDown className="w-3.5 h-3.5" />
              Insert Variable
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
    </div>
  );
};

