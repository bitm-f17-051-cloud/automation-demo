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
import { XIcon, Trash2, Plus, Sparkles, Check } from "lucide-react";
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
  "exists",
  "does not exist",
  "is empty",
  "is not empty",
  "is equal to",
  "is not equal to",
  "contains",
  "does not contain",
  "starts with",
  "does not start with",
  "ends with",
  "does not end with"
] as const;

type FilterType = typeof TRIGGER_OUTPUT_FIELDS[number]["value"] | "";

const AppointmentSettingTrigger = ({ goBack, nodeData }: Props) => {
  const triggerMeta = getTriggerByValue(TriggersEnum.SCHEDULER_WATCH_APPOINTMENT_SETTING_OUTCOME);
  const IconComponent = triggerMeta?.icon;
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [triggerName, setTriggerName] = useState<string>(nodeData?.nodeName || triggerMeta?.label || "Appointment Setting Outcome");
  
  // Outcome states
  const [outcomes, setOutcomes] = useState<{ [k: string]: boolean }>({
    Approved: nodeData?.nodeData?.outcomes?.Approved || false,
    Rejected: nodeData?.nodeData?.outcomes?.Rejected || false,
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
    if (rows.length === 0) rows.push({ id: uuidv4(), type: "", values: [], operator: "AND", comparisonOperator: "is equal to" });
    return rows;
  })();
  const [rows, setRows] = useState<FilterRow[]>(bootstrapRows);

  const addRow = () => {
    setRows([...rows, { id: uuidv4(), type: "", values: [], operator: "AND", comparisonOperator: "is equal to" }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const setRowType = (id: string, newType: FilterType) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, type: newType, values: [], textValue: "", comparisonOperator: "is equal to" };
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

    const properties: Array<{ key: string; value: any }> = [];
    
    // Add outcomes to properties
    const selectedOutcomes = ["Approved", "Rejected"].filter(k => outcomes[k]);
    if (selectedOutcomes.length > 0) {
      properties.push({ key: "outcome", value: selectedOutcomes });
    }
    
    // Save all filter rows
    const filters = rows.filter(r => r.type).map(r => ({
      type: r.type,
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
      nodeType: TriggersEnum.SCHEDULER_WATCH_APPOINTMENT_SETTING_OUTCOME,
      nodeName: triggerName,
      nodeIcon: "scheduler_trigger",
      nodeDescription: "",
      nodeData: {
        outcomes: outcomes,
        filters: filters,
      },
      properties,
    };
    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const renderOptions = (row: FilterRow) => {
    // All fields are text fields with comparison operators
    const hideTextInput = row.comparisonOperator === "is empty" || row.comparisonOperator === "is not empty" || row.comparisonOperator === "exists" || row.comparisonOperator === "does not exist";
    
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

        {/* Outcome Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Outcome <span className="text-red-500">*</span></h4>
          <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
            {/* Select All */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={Object.values(outcomes).every(v => v)}
                onCheckedChange={(checked) => {
                  const newState = checked === true;
                  setOutcomes({
                    Approved: newState,
                    Rejected: newState,
                  });
                }}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                Select All
              </span>
            </label>

            {/* Approved */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={outcomes["Approved"]}
                onCheckedChange={() => setOutcomes((s) => ({ ...s, Approved: !s.Approved }))}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                Approved
              </span>
            </label>

            {/* Rejected */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={outcomes["Rejected"]}
                onCheckedChange={() => setOutcomes((s) => ({ ...s, Rejected: !s.Rejected }))}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                Rejected
              </span>
            </label>
          </div>
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
                          <SelectItem value="id" className="font-mono text-xs">ID</SelectItem>
                          <SelectItem value="direction" className="font-mono text-xs">direction</SelectItem>
                          <SelectItem value="status" className="font-mono text-xs">status</SelectItem>
                          <SelectItem value="started_at" className="font-mono text-xs">started_at</SelectItem>
                          <SelectItem value="ended_at" className="font-mono text-xs">ended_at</SelectItem>
                          <SelectItem value="duration" className="font-mono text-xs">duration</SelectItem>
                          <SelectItem value="missed_call" className="font-mono text-xs">missed_call</SelectItem>
                          <SelectItem value="recording_url" className="font-mono text-xs">recording_url</SelectItem>
                          <SelectItem value="voicemail" className="font-mono text-xs">voicemail</SelectItem>
                          
                          {/* Users object */}
                          <div key="users-header" className="px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-50 mt-1">users</div>
                          <SelectItem value="users.id" className="pl-6 font-mono text-xs">ID</SelectItem>
                          <SelectItem value="users.name" className="pl-6 font-mono text-xs">name</SelectItem>
                          <SelectItem value="users.email" className="pl-6 font-mono text-xs">email</SelectItem>
                          
                          {/* Contacts object */}
                          <div key="contacts-header" className="px-2 py-1 text-xs font-semibold text-gray-900 bg-gray-50 mt-1">contacts</div>
                          <SelectItem value="contacts.id" className="pl-6 font-mono text-xs">ID</SelectItem>
                          <SelectItem value="contacts.name" className="pl-6 font-mono text-xs">name</SelectItem>
                          
                          {/* Contacts.phone_number nested */}
                          <div key="phone-number-header" className="pl-6 py-1 text-xs font-medium text-gray-700">phone_number</div>
                          <SelectItem value="contacts.phone_number.value" className="pl-10 font-mono text-xs">value</SelectItem>
                          
                          {/* Contacts.number nested */}
                          <div key="number-header" className="pl-6 py-1 text-xs font-medium text-gray-700">number</div>
                          <SelectItem value="contacts.number.id" className="pl-10 font-mono text-xs">id</SelectItem>
                          <SelectItem value="contacts.number.name" className="pl-10 font-mono text-xs">name</SelectItem>
                          <SelectItem value="contacts.number.digits" className="pl-10 font-mono text-xs">digits</SelectItem>
                          
                          {/* Remaining contacts fields */}
                          <SelectItem value="contacts.tags" className="pl-6 font-mono text-xs">tags</SelectItem>
                          <SelectItem value="contacts.notes" className="pl-6 font-mono text-xs">notes</SelectItem>
                          <SelectItem value="contacts.custom_fields" className="pl-6 font-mono text-xs">custom_fields</SelectItem>
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

export default AppointmentSettingTrigger;

