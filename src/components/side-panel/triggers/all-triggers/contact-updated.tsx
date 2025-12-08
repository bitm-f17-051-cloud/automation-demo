/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { getTriggerByValue } from "@/utils/side-panel/triggers/triggers.constants";
import { TriggersEnum } from "@/utils/side-panel/triggers/triggers.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectWithFilterPanel } from "@/components/ui/select-with-filter-panel";
import { XIcon, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedTrigger: string;
};

// Trigger Output Fields - Nested structure
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
] as const;

// Text field comparison operators
const COMPARISON_OPERATORS = [
  "Is",
  "Is not",
  "Contains",
  "Does not contain",
  "Is any of (comma separated)",
  "Is none of (comma separated)",
  "Is not empty",
  "Is empty"
] as const;

type FilterType = typeof TRIGGER_OUTPUT_FIELDS[number]["value"] | "";

const TRIGGER_FIELDS = [
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "status", label: "Status" },
  { key: "secondary_email", label: "Secondary Email" },
  { key: "secondary_phoneNumber", label: "Secondary Phone Number" },
] as const;

const ContactUpdatedTrigger = ({ goBack, nodeData, selectedTrigger }: Props) => {
  const triggerMeta = getTriggerByValue(selectedTrigger);
  const IconComponent = triggerMeta?.icon;
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [triggerName, setTriggerName] = useState<string>(nodeData?.nodeName || triggerMeta?.label || "Contact Updated");
  
  // Trigger field states
  const [triggerFields, setTriggerFields] = useState<{ [k: string]: boolean }>(() => {
    const initial: { [k: string]: boolean } = {};
    TRIGGER_FIELDS.forEach(field => {
      initial[field.key] = nodeData?.nodeData?.triggerFields?.[field.key] || false;
    });
    return initial;
  });

  // Row-based filters with AND/OR logic
  type FilterRow = { 
    id: string; 
    type: FilterType; 
    values: string[]; // for Event/Contact Stage
    textValue?: string; // for text field filters
    comparisonOperator?: typeof COMPARISON_OPERATORS[number]; // comparison operator for text fields
    operator?: "AND" | "OR"; // operator before this row
  };
  
  const bootstrapRows: FilterRow[] = (() => {
    const rows: FilterRow[] = [];
    const nd = nodeData?.nodeData;
    if (nd?.filters && nd.filters.length > 0) {
      nd.filters.forEach((filter: any) => {
        rows.push({
          id: uuidv4(),
          type: filter.type,
          values: filter.values || [],
          textValue: filter.textValue || "",
          comparisonOperator: filter.comparisonOperator || "Is",
          operator: filter.operator || "AND"
        });
      });
    }
    if (rows.length === 0) rows.push({ id: uuidv4(), type: "", values: [], operator: "AND", comparisonOperator: "Is" });
    return rows;
  })();
  const [rows, setRows] = useState<FilterRow[]>(bootstrapRows);

  const setRowType = (rowId: string, type: FilterType) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, type, values: [], textValue: "", comparisonOperator: "Is" } : r)));
  
  const toggleRowValue = (rowId: string, value: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id !== rowId
          ? r
          : {
              ...r,
              values: r.values.includes(value)
                ? r.values.filter((v) => v !== value)
                : [...r.values, value],
            }
      )
    );
  
  const setRowTextValue = (rowId: string, textValue: string) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, textValue } : r)));
  
  const setRowComparisonOperator = (rowId: string, comparisonOperator: typeof COMPARISON_OPERATORS[number]) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, comparisonOperator } : r)));
  
  const setRowOperator = (rowId: string, operator: "AND" | "OR") =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, operator } : r)));
  
  const removeRow = (rowId: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rowId) : prev));
  
  const addRow = () => setRows((prev) => [...prev, { id: uuidv4(), type: "", values: [], operator: "AND", comparisonOperator: "Is" }]);

  const saveAction = () => {
    if (!selectedNodeId) return;
    const properties: Array<{ key: string; value: any }> = [];
    
    // Add trigger fields to properties
    const selectedTriggerFields = TRIGGER_FIELDS.filter(field => triggerFields[field.key]).map(field => field.key);
    if (selectedTriggerFields.length > 0) {
      properties.push({ key: "trigger_fields", value: selectedTriggerFields });
    }
    
    // Save all filter rows
    const filters = rows.filter(r => r.type).map(r => ({
      type: r.type,
      values: r.values,
      textValue: r.textValue || "",
      comparisonOperator: r.comparisonOperator || "Is",
      operator: r.operator || "AND"
    }));

    filters.forEach((filter) => {
      if (filter.type) {
        properties.push({ 
          key: `${filter.operator}_${filter.type}`, 
          value: filter.textValue 
        });
      }
    });

    const config = {
      nodeType: TriggersEnum.INBOUND_WATCH_CONTACT_UPDATE,
      nodeName: triggerName,
      nodeIcon: "field_updated",
      nodeDescription: "",
      nodeData: {
        triggerFields: triggerFields,
        filters: filters,
      },
      properties,
    };
    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Trigger Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Trigger Name</label>
            <Input
              placeholder="Enter a name for this trigger"
              className="h-10 text-sm"
              value={triggerName}
              onChange={(e) => setTriggerName(e.target.value)}
            />
          </div>

          <Separator />

          {/* Trigger Fields Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-900">Trigger <span className="text-red-500">*</span></h4>
              
              {/* Select All for Trigger Fields */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={TRIGGER_FIELDS.every(field => triggerFields[field.key])}
                  onCheckedChange={(checked) => {
                    const newVal = checked === true;
                    const newTriggerFields: { [k: string]: boolean } = {};
                    TRIGGER_FIELDS.forEach(field => {
                      newTriggerFields[field.key] = newVal;
                    });
                    setTriggerFields(newTriggerFields);
                  }}
                  className="h-5 w-5 border-2 border-purple-500 data-[state=checked]:bg-purple-500"
                />
                <span className="text-base text-gray-700 group-hover:text-gray-900">
                  Select All
                </span>
              </label>

              {/* Trigger Field Options Container */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                {TRIGGER_FIELDS.map(field => (
                  <label key={field.key} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={triggerFields[field.key]}
                      onCheckedChange={() => setTriggerFields((s) => ({ ...s, [field.key]: !s[field.key] }))}
                      className="h-5 w-5 border-2 border-purple-500 data-[state=checked]:bg-purple-500"
                    />
                    <span className="text-base text-gray-700 group-hover:text-gray-900">
                      {field.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-gray-900">Filter Conditions</h4>
                <p className="text-sm text-gray-500 mt-0.5">Define when this trigger should activate</p>
              </div>
            </div>

            <div className="space-y-4">
              {rows.map((row, index) => {
                return (
                  <div key={row.id} className="space-y-3">
                    {/* AND/OR Toggle - show before each filter except the first */}
                    {index > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRowOperator(row.id, "AND")}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            row.operator === "AND"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          AND
                        </button>
                        <button
                          type="button"
                          onClick={() => setRowOperator(row.id, "OR")}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            row.operator === "OR"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          OR
                        </button>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-4">
                          {/* Filter Type */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Filter Type</label>
                            <SelectWithFilterPanel
                              value={row.type}
                              onValueChange={(value) => setRowType(row.id, value as FilterType)}
                              placeholder="Select filter type"
                              className="h-11 bg-white border-gray-300"
                            />
                          </div>

                          {/* Filter Values - Text Input for all fields */}
                          {row.type && (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Comparison</label>
                                <Select 
                                  value={row.comparisonOperator || "Is"} 
                                  onValueChange={(value) => setRowComparisonOperator(row.id, value as typeof COMPARISON_OPERATORS[number])}
                                >
                                  <SelectTrigger className="h-11 bg-white border-gray-300">
                                    <SelectValue placeholder="Select comparison" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {COMPARISON_OPERATORS.map((op) => (
                                      <SelectItem key={op} value={op}>{op}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Only show text input if comparison is not "Is empty" or "Is not empty" */}
                              {row.comparisonOperator !== "Is empty" && row.comparisonOperator !== "Is not empty" && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Value</label>
                                  <Input
                                    placeholder="Write option"
                                    className="h-11 bg-white border-gray-300 text-sm"
                                    value={row.textValue || ""}
                                    onChange={(e) => setRowTextValue(row.id, e.target.value)}
                                  />
                                </div>
                              )}
                            </>
                          )}

                        </div>

                        {/* Delete button */}
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove filter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Filter Button */}
            <button
              onClick={addRow}
              className="w-fit py-2 px-3 mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add filter
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton
            onClick={saveAction}
            isPrimary
            className="px-6"
          >
            Save Trigger
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ContactUpdatedTrigger;

