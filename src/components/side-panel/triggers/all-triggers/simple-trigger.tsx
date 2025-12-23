/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { getTriggerByValue } from "@/utils/side-panel/triggers/triggers.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectWithFilterPanel } from "@/components/ui/select-with-filter-panel";
import { XIcon, Trash2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

const SimpleTrigger = ({ goBack, nodeData, selectedTrigger }: Props) => {
  const triggerMeta = getTriggerByValue(selectedTrigger);
  const IconComponent = triggerMeta?.icon;
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [triggerName, setTriggerName] = useState<string>(
    nodeData?.nodeName || triggerMeta?.label || "Trigger"
  );

  // Row-based filters with AND/OR logic
  type FilterRow = { 
    id: string; 
    type: FilterType; 
    textValue?: string;
    comparisonOperator?: typeof COMPARISON_OPERATORS[number];
    operator?: "AND" | "OR";
  };
  
  const bootstrapRows: FilterRow[] = (() => {
    const rows: FilterRow[] = [];
    const nd = nodeData?.nodeData;
    if (nd?.filters && nd.filters.length > 0) {
      nd.filters.forEach((filter: any) => {
        rows.push({
          id: uuidv4(),
          type: filter.type,
          textValue: filter.textValue || "",
          comparisonOperator: filter.comparisonOperator || "is equal to",
          operator: filter.operator || "AND"
        });
      });
    }
    if (rows.length === 0) rows.push({ id: uuidv4(), type: "", operator: "AND", comparisonOperator: "is equal to" });
    return rows;
  })();
  const [rows, setRows] = useState<FilterRow[]>(bootstrapRows);

  const setRowType = (rowId: string, type: FilterType) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, type, textValue: "", comparisonOperator: "is equal to" } : r)));
  
  const setRowTextValue = (rowId: string, textValue: string) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, textValue } : r)));
  
  const setRowComparisonOperator = (rowId: string, comparisonOperator: typeof COMPARISON_OPERATORS[number]) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, comparisonOperator } : r)));
  
  const setRowOperator = (rowId: string, operator: "AND" | "OR") =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, operator } : r)));
  
  const removeRow = (rowId: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rowId) : prev));
  
  const addRow = () => setRows((prev) => [...prev, { id: uuidv4(), type: "", operator: "AND", comparisonOperator: "is equal to" }]);

  const saveAction = () => {
    if (!selectedNodeId) return;

    const properties: Array<{ key: string; value: any }> = [];
    
    // Save all filter rows
    const filters = rows.filter(r => r.type).map(r => ({
      type: r.type,
      textValue: r.textValue || "",
      comparisonOperator: r.comparisonOperator || "is equal to",
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
      nodeType: selectedTrigger,
      nodeName: triggerName,
      nodeIcon: selectedTrigger,
      nodeDescription: triggerMeta?.description || "",
      nodeData: {
        filters: filters,
      },
      properties,
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Scrollable Content */}
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

          {/* Filters Section */}
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
              {rows.map((row, index) => {
                return (
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
                          <SelectWithFilterPanel
                            value={row.type}
                            onValueChange={(value) => setRowType(row.id, value as FilterType)}
                            placeholder="Select filter type"
                            className="w-full bg-white border-gray-300"
                          />

                          {/* Comparison Operator */}
                          {row.type && (
                            <Select 
                              value={row.comparisonOperator || "is equal to"} 
                              onValueChange={(value) => setRowComparisonOperator(row.id, value as typeof COMPARISON_OPERATORS[number])}
                            >
                              <SelectTrigger className="w-full bg-white border-gray-300">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {COMPARISON_OPERATORS.map((op) => (
                                  <SelectItem key={op} value={op}>{op}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {/* Filter Value Input */}
                          {row.type && row.comparisonOperator !== "is empty" && row.comparisonOperator !== "is not empty" && row.comparisonOperator !== "exists" && row.comparisonOperator !== "does not exist" && (
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
                );
              })}
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

export default SimpleTrigger;

