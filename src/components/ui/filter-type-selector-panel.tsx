import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Trigger output fields structure for filter types
const TRIGGER_OUTPUT_FIELDS = [
  // Root level
  { value: "id", label: "ID", category: "root" },
  { value: "direction", label: "direction", category: "root" },
  { value: "status", label: "status", category: "root" },
  { value: "started_at", label: "started_at", category: "root" },
  { value: "ended_at", label: "ended_at", category: "root" },
  { value: "duration", label: "duration", category: "root" },
  { value: "missed_call", label: "missed_call", category: "root" },
  { value: "recording_url", label: "recording_url", category: "root" },
  { value: "voicemail", label: "voicemail", category: "root" },
  
  // Users object
  { value: "users.id", label: "ID", category: "users" },
  { value: "users.name", label: "name", category: "users" },
  { value: "users.email", label: "email", category: "users" },
  
  // Contacts object
  { value: "contacts.id", label: "ID", category: "contacts" },
  { value: "contacts.name", label: "name", category: "contacts" },
  { value: "contacts.phone_number.value", label: "value", category: "contacts.phone_number" },
  { value: "contacts.number.id", label: "id", category: "contacts.number" },
  { value: "contacts.number.name", label: "name", category: "contacts.number" },
  { value: "contacts.number.digits", label: "digits", category: "contacts.number" },
  { value: "contacts.tags", label: "tags", category: "contacts" },
  { value: "contacts.notes", label: "notes", category: "contacts" },
  { value: "contacts.custom_fields", label: "custom_fields", category: "contacts" },
];

type FilterTypeSelectorPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export const FilterTypeSelectorPanel = ({
  isOpen,
  onClose,
  onSelect,
}: FilterTypeSelectorPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredFields = TRIGGER_OUTPUT_FIELDS.filter((field) =>
    field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFields = filteredFields.reduce((acc, field) => {
    const category = field.category.split('.')[0]; // Get main category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {} as Record<string, typeof TRIGGER_OUTPUT_FIELDS>);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      root: "Root",
      users: "users",
      contacts: "contacts",
    };
    return labels[category] || category;
  };

  const getIndentLevel = (category: string) => {
    if (category.includes('phone_number')) return 'pl-10';
    if (category.includes('number')) return 'pl-10';
    if (category === 'users' || category === 'contacts') return 'pl-6';
    return 'pl-0';
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Select Filter Type</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-4">
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2 py-1 bg-gray-50">
                {getCategoryLabel(category)}
              </h4>
              <div className="space-y-1">
                {fields.map((field) => (
                  <button
                    key={field.value}
                    type="button"
                    onClick={() => onSelect(field.value)}
                    className={`w-full text-left px-2 py-2 text-xs font-mono text-gray-700 hover:bg-gray-50 rounded-md transition-colors ${getIndentLevel(field.category)}`}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

