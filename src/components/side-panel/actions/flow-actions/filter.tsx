/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectWithFilterPanel } from "@/components/ui/select-with-filter-panel";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Filter, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflow.store";
import { v4 as uuidv4 } from "uuid";

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

type FilterType = typeof TRIGGER_OUTPUT_FIELDS[number]["value"] | "";

type FilterRow = {
  id: string;
  type: FilterType;
  textValue?: string;
  comparisonOperator?: typeof COMPARISON_OPERATORS[number];
  operator?: "AND" | "OR";
};

type FilterActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

const FilterAction = ({ goBack, nodeData }: FilterActionProps) => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Filter");

  // Row-based filters with AND/OR logic
  const bootstrapRows: FilterRow[] = (() => {
    const rows: FilterRow[] = [];
    const nd = nodeData?.nodeData;
    if (nd?.filters && nd.filters.length > 0) {
      nd.filters.forEach((filter: any) => {
        rows.push({
          id: uuidv4(),
          type: filter.type,
          textValue: filter.textValue || "",
          comparisonOperator: filter.comparisonOperator || "Is",
          operator: filter.operator || "AND"
        });
      });
    }
    if (rows.length === 0) rows.push({ id: uuidv4(), type: "", textValue: "", operator: "AND", comparisonOperator: "Is" });
    return rows;
  })();
  const [rows, setRows] = useState<FilterRow[]>(bootstrapRows);

  const setRowType = (rowId: string, type: FilterType) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, type, textValue: "", comparisonOperator: "Is" } : r)));
  
  const setRowTextValue = (rowId: string, textValue: string) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, textValue } : r)));
  
  const setRowComparisonOperator = (rowId: string, comparisonOperator: typeof COMPARISON_OPERATORS[number]) =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, comparisonOperator } : r)));
  
  const setRowOperator = (rowId: string, operator: "AND" | "OR") =>
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, operator } : r)));
  
  const removeRow = (rowId: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== rowId) : prev));
  
  const addRow = () => setRows((prev) => [...prev, { id: uuidv4(), type: "", textValue: "", operator: "AND", comparisonOperator: "Is" }]);

  const saveAction = () => {
    if (!selectedNodeId) return;

    const filters = rows.filter(r => r.type).map(r => ({
      type: r.type,
      textValue: r.textValue || "",
      comparisonOperator: r.comparisonOperator || "Is",
      operator: r.operator || "AND"
    }));

    const properties: Array<{ key: string; value: any }> = [];
    filters.forEach((filter) => {
      if (filter.type) {
        properties.push({ 
          key: `${filter.operator}_${filter.type}`, 
          value: filter.textValue 
        });
      }
    });

    const config = {
      nodeName: actionName,
      nodeType: "flow_filter",
      nodeIcon: "flow_filter",
      nodeDescription: filters.length > 0 ? `${filters.length} filter${filters.length > 1 ? 's' : ''}` : "Filter workflow data",
      nodeData: {
        filters: filters,
      },
      properties,
    };

    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
  };

  const isValid = rows.some(r => r.type && r.textValue);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={goBack}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Filter</h2>
              <p className="text-xs text-gray-500">Filter workflow data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Action Name</Label>
            <Input
              placeholder="Enter action name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="h-10 text-sm"
            />
          </div>

          <Separator />

          {/* Filters Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-semibold text-gray-900">Filters</h4>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                {rows.length}
              </span>
            </div>
            <p className="text-sm text-gray-500 -mt-1">Specify filter conditions</p>

            <div className="space-y-4">
              {rows.map((row, index) => {
                return (
                  <div key={row.id} className="space-y-3">
                    {/* AND/OR Toggle - show before each filter except the first */}
                    {index > 0 && (
                      <div className="flex items-center gap-2">
                        <Select value={row.operator || "AND"} onValueChange={(value: "AND" | "OR") => setRowOperator(row.id, value)}>
                          <SelectTrigger className="h-9 w-32 bg-white border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                      {/* Filter Type + Comparison Operator Row */}
                      <div className="flex items-center gap-3">
                        <SelectWithFilterPanel
                          value={row.type}
                          onValueChange={(value) => setRowType(row.id, value as FilterType)}
                          placeholder="Select filter"
                          className="flex-1 bg-white border-gray-300"
                        />

                        {row.type && (
                          <Select
                            value={row.comparisonOperator || "Is"}
                            onValueChange={(val) => setRowComparisonOperator(row.id, val as typeof COMPARISON_OPERATORS[number])}
                          >
                            <SelectTrigger className="w-40 h-11 bg-white border-gray-300">
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMPARISON_OPERATORS.map((op) => (
                                <SelectItem key={op} value={op}>{op}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      {/* Filter Value Input */}
                      {row.type && (
                        <div className="space-y-2">
                          <Input
                            type="text"
                            placeholder="Enter value"
                            value={row.textValue || ""}
                            onChange={(e) => setRowTextValue(row.id, e.target.value)}
                            className="w-full bg-white"
                          />
                        </div>
                      )}

                      {/* Remove Button */}
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove filter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Another Filter Button */}
            <button
              type="button"
              onClick={addRow}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Filter
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <Button 
          onClick={saveAction} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!isValid}
        >
          Save Filter Action
        </Button>
      </div>
    </div>
  );
};

export default FilterAction;

