/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon, Check, Trash2, Plus, Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FieldUpdatedIcon } from "@/components/assets/icons/triggers";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedTrigger: string;
};

// Mock custom fields - in a real app, these would come from an API
const CUSTOM_FIELDS = [
  "No Sales Reason",
  "Abdul Rehman",
  "cha",
  "Checkbox 1",
  "testing",
  "field",
  "uujjbj"
];

// Trigger Output Fields - Nested structure matching API response
const TRIGGER_OUTPUT_FIELDS = [
  // Root level
  { value: "id", label: "ID", category: "root", indent: 0 },
  { value: "direction", label: "direction", category: "root", indent: 0 },
  { value: "status", label: "status", category: "root", indent: 0 },
  { value: "started_at", label: "started_at", category: "root", indent: 0 },
  { value: "ended_at", label: "ended_at", category: "root", indent: 0 },
  { value: "duration", label: "duration", category: "root", indent: 0 },
  { value: "missed_call", label: "missed_call", category: "root", indent: 0 },
  { value: "recording_url", label: "recording_url", category: "root", indent: 0 },
  { value: "voicemail", label: "voicemail", category: "root", indent: 0 },
  
  // Users object
  { value: "users.id", label: "ID", category: "users", indent: 1 },
  { value: "users.name", label: "name", category: "users", indent: 1 },
  { value: "users.email", label: "email", category: "users", indent: 1 },
  
  // Contacts object
  { value: "contacts.id", label: "ID", category: "contacts", indent: 1 },
  { value: "contacts.name", label: "name", category: "contacts", indent: 1 },
  
  // Contacts.phone_number nested object
  { value: "contacts.phone_number.value", label: "value", category: "contacts.phone_number", indent: 2 },
  
  // Contacts.number nested object
  { value: "contacts.number.id", label: "id", category: "contacts.number", indent: 2 },
  { value: "contacts.number.name", label: "name", category: "contacts.number", indent: 2 },
  { value: "contacts.number.digits", label: "digits", category: "contacts.number", indent: 2 },
  
  // Contacts continued
  { value: "contacts.tags", label: "tags", category: "contacts", indent: 1 },
  { value: "contacts.notes", label: "notes", category: "contacts", indent: 1 },
  { value: "contacts.custom_fields", label: "custom_fields", category: "contacts", indent: 1 },
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

const ContactCustomFieldTrigger = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [triggerName, setTriggerName] = useState<string>(nodeData?.nodeName || "Contact Custom field" || "Trigger");
  const [selectedCustomField, setSelectedCustomField] = useState<string>(nodeData?.nodeData?.customField || "");

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

  const addRow = () => {
    setRows([...rows, { id: uuidv4(), type: "", values: [], operator: "AND", comparisonOperator: "Is" }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const setRowType = (id: string, newType: FilterType) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        // Clear values when changing type
        return { ...row, type: newType, values: [], textValue: "", comparisonOperator: "Is" };
      }
      return row;
    }));
  };

  const toggleRowValue = (rowId: string, value: string) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        const newValues = row.values.includes(value)
          ? row.values.filter(v => v !== value)
          : [...row.values, value];
        return { ...row, values: newValues };
      }
      return row;
    }));
  };

  const setRowTextValue = (rowId: string, textValue: string) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return { ...row, textValue };
      }
      return row;
    }));
  };

  const setRowComparisonOperator = (rowId: string, operator: typeof COMPARISON_OPERATORS[number]) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return { ...row, comparisonOperator: operator };
      }
      return row;
    }));
  };

  const setRowOperator = (rowId: string, operator: "AND" | "OR") => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        return { ...row, operator };
      }
      return row;
    }));
  };

  const saveAction = () => {
    if (!selectedNodeId) return;

    const filters = rows.map(row => ({
      type: row.type,
      values: row.values,
      textValue: row.textValue || "",
      comparisonOperator: row.comparisonOperator || "Is",
      operator: row.operator || "AND"
    }));

    const properties: Array<{ key: string; value: any }> = [];
    
    // Add custom field to properties
    if (selectedCustomField) {
      properties.push({ key: "customField", value: selectedCustomField });
    }
    
    // Add filters to properties - all are text fields now
    filters.forEach((filter) => {
      if (filter.type) {
        properties.push({ 
          key: `${filter.operator}_${filter.type}`, 
          value: filter.textValue 
        });
      }
    });

    const config = {
      nodeType: "inbound_custom_contact_field_updated",
      nodeName: triggerName,
      nodeIcon: "field_updated",
      nodeDescription: "",
      nodeData: {
        customField: selectedCustomField,
        filters: filters,
      },
      properties,
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const renderOptions = (row: FilterRow) => {
    // All fields are text fields (trigger output data)
    if (row.type) {
      const hideTextInput = row.comparisonOperator === "Is empty" || row.comparisonOperator === "Is not empty";
      
      return (
        <div className="space-y-3">
          <Select
            value={row.comparisonOperator}
            onValueChange={(value) => setRowComparisonOperator(row.id, value as typeof COMPARISON_OPERATORS[number])}
          >
            <SelectTrigger className="w-full bg-white border-gray-300">
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {COMPARISON_OPERATORS.map(op => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!hideTextInput && (
            <Input
              type="text"
              placeholder={
                row.comparisonOperator?.includes("comma separated") 
                  ? "Enter values separated by commas" 
                  : "Enter value"
              }
              value={row.textValue || ""}
              onChange={(e) => setRowTextValue(row.id, e.target.value)}
              className="w-full"
            />
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Trigger Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Trigger Name
          </label>
          <Input
            type="text"
            value={triggerName}
            onChange={(e) => setTriggerName(e.target.value)}
            className="w-full"
            placeholder="Enter trigger name"
          />
        </div>

        <Separator className="bg-gray-200" />

        {/* Custom Field Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Custom Field <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedCustomField}
            onValueChange={setSelectedCustomField}
          >
            <SelectTrigger className="w-full bg-white border-gray-300">
              <div className="flex items-center justify-between w-full">
                <SelectValue placeholder="Select a custom field" />
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <div className="px-3 py-2 border-b border-gray-200">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8"
                  />
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              {CUSTOM_FIELDS.map(field => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-200" />

        {/* Filter Conditions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Filter Conditions
            </label>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Advanced filters</span>
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={row.id} className="space-y-3">
                {/* AND/OR Toggle (show for all rows except first) */}
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

                {/* Filter Row Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      {/* Type Selector */}
                      <Select
                        value={row.type}
                        onValueChange={(value) => setRowType(row.id, value as FilterType)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select filter type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[400px]">
                          {/* Root level fields */}
                          <SelectItem value="id" className="font-mono text-xs">
                            ID
                          </SelectItem>
                          <SelectItem value="direction" className="font-mono text-xs">
                            direction
                          </SelectItem>
                          <SelectItem value="status" className="font-mono text-xs">
                            status
                          </SelectItem>
                          <SelectItem value="started_at" className="font-mono text-xs">
                            started_at
                          </SelectItem>
                          <SelectItem value="ended_at" className="font-mono text-xs">
                            ended_at
                          </SelectItem>
                          <SelectItem value="duration" className="font-mono text-xs">
                            duration
                          </SelectItem>
                          <SelectItem value="missed_call" className="font-mono text-xs">
                            missed_call
                          </SelectItem>
                          <SelectItem value="recording_url" className="font-mono text-xs">
                            recording_url
                          </SelectItem>
                          <SelectItem value="voicemail" className="font-mono text-xs">
                            voicemail
                          </SelectItem>
                          
                          {/* Users object */}
                          <div key="users-header" className="px-2 py-1 text-xs font-semibold text-gray-900 mt-1">
                            users
                          </div>
                          <SelectItem value="users.id" className="pl-6 font-mono text-xs">
                            ID
                          </SelectItem>
                          <SelectItem value="users.name" className="pl-6 font-mono text-xs">
                            name
                          </SelectItem>
                          <SelectItem value="users.email" className="pl-6 font-mono text-xs">
                            email
                          </SelectItem>
                          
                          {/* Contacts object */}
                          <div key="contacts-header" className="px-2 py-1 text-xs font-semibold text-gray-900 mt-1">
                            contacts
                          </div>
                          <SelectItem value="contacts.id" className="pl-6 font-mono text-xs">
                            ID
                          </SelectItem>
                          <SelectItem value="contacts.name" className="pl-6 font-mono text-xs">
                            name
                          </SelectItem>
                          
                          {/* Contacts.phone_number nested */}
                          <div key="phone-number-header" className="pl-6 py-1 text-xs font-medium text-gray-700">
                            phone_number
                          </div>
                          <SelectItem value="contacts.phone_number.value" className="pl-10 font-mono text-xs">
                            value
                          </SelectItem>
                          
                          {/* Contacts.number nested */}
                          <div key="number-header" className="pl-6 py-1 text-xs font-medium text-gray-700">
                            number
                          </div>
                          <SelectItem value="contacts.number.id" className="pl-10 font-mono text-xs">
                            id
                          </SelectItem>
                          <SelectItem value="contacts.number.name" className="pl-10 font-mono text-xs">
                            name
                          </SelectItem>
                          <SelectItem value="contacts.number.digits" className="pl-10 font-mono text-xs">
                            digits
                          </SelectItem>
                          
                          {/* Remaining contacts fields */}
                          <SelectItem value="contacts.tags" className="pl-6 font-mono text-xs">
                            tags
                          </SelectItem>
                          <SelectItem value="contacts.notes" className="pl-6 font-mono text-xs">
                            notes
                          </SelectItem>
                          <SelectItem value="contacts.custom_fields" className="pl-6 font-mono text-xs">
                            custom_fields
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Options */}
                      {row.type && renderOptions(row)}
                    </div>

                    {/* Delete Button */}
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Filter Button */}
          <button
            type="button"
            onClick={addRow}
            className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Filter
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <PrimaryButton
          onClick={saveAction}
          className="w-full flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save Trigger
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ContactCustomFieldTrigger;

