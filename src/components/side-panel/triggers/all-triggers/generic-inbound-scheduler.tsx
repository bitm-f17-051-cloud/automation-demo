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
import { XIcon, Trash2, Plus, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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

const GenericInboundSchedulerTrigger = ({ goBack, nodeData, selectedTrigger }: Props) => {
  const triggerMeta = getTriggerByValue(selectedTrigger);
  const IconComponent = triggerMeta?.icon;
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [description, setDescription] = useState("");
  const [triggerName, setTriggerName] = useState<string>(nodeData?.nodeName || triggerMeta?.label || "");

  // Common form states
  const [customFieldSearch, setCustomFieldSearch] = useState("");
  const [outcomes, setOutcomes] = useState<{ [k: string]: boolean }>({
    Approved: false,
    Rejected: false,
    "No Sale": false,
    Sale: false,
  });
  const [eventTypes, setEventTypes] = useState<{ [k: string]: boolean }>({
    "Strategy Event": false,
    "Discovery Event": false,
  });
  const [triggerOutcomeFlags, setTriggerOutcomeFlags] = useState<{ [k: string]: boolean }>({
    Added: false,
    Updated: false,
  });
  
  // Contact by Status states
  const [finalStatus, setFinalStatus] = useState<string>(nodeData?.nodeData?.finalStatus || "");
  const [waitSeconds, setWaitSeconds] = useState<string>(nodeData?.nodeData?.waitSeconds?.toString() || "");
  const [sendLastActiveStatus, setSendLastActiveStatus] = useState<string>(nodeData?.nodeData?.sendLastActiveStatus || "");

  // Filter state
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
          comparisonOperator: filter.comparisonOperator || "Is",
          operator: filter.operator || "AND"
        });
      });
    }
    if (rows.length === 0) rows.push({ id: uuidv4(), type: "", operator: "AND", comparisonOperator: "Is" });
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
  
  const addRow = () => setRows((prev) => [...prev, { id: uuidv4(), type: "", operator: "AND", comparisonOperator: "Is" }]);

  useEffect(() => {
    if (nodeData) {
      setDescription(nodeData?.nodeDescription || "");
      const nd = nodeData?.nodeData || {};
      setCustomFieldSearch(nd.customFieldSearch || "");
      setOutcomes(nd.outcomes || outcomes);
      setEventTypes(nd.eventTypes || eventTypes);
      setTriggerOutcomeFlags(nd.triggerOutcomeFlags || triggerOutcomeFlags);
      setFinalStatus(nd.finalStatus || "");
      setWaitSeconds(nd.waitSeconds?.toString() || "");
      setSendLastActiveStatus(nd.sendLastActiveStatus || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId, nodeData]);

  const showCustomField = selectedTrigger === TriggersEnum.INBOUND_CUSTOM_CONTACT_FIELD_UPDATED;
  const showEventType =
    selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CALL_BOOKED ||
    selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CANCELLED_CALL;
  const showOutcomes =
    selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CALL_OUTCOME ||
    selectedTrigger === TriggersEnum.INBOUND_CUSTOM_CONTACT_FIELD_UPDATED;
  const showOutcomeFlags = selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CALL_OUTCOME;
  const showFilters = 
    selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CALL_OUTCOME;
  const showContactByStatus = selectedTrigger === TriggersEnum.SCHEDULER_WATCH_CONTACT_BY_STATUS;

  const isSaveDisabled = useMemo(() => {
    // very light validation to enable save
    if (showCustomField && !customFieldSearch.trim()) return true;
    if (showEventType && !Object.values(eventTypes).some(v => v)) return true;
    if (showOutcomes && !Object.values(outcomes).some(v => v)) return true;
    if (showOutcomeFlags && !Object.values(triggerOutcomeFlags).some(v => v)) return true;
    if (showContactByStatus && !finalStatus.trim()) return true;
    return false;
  }, [showCustomField, customFieldSearch, showEventType, eventTypes, showOutcomes, outcomes, showOutcomeFlags, triggerOutcomeFlags, showContactByStatus, finalStatus]);

  const saveAction = () => {
    if (!selectedNodeId) return;
    
    const properties: Array<{ key: string; value: any }> = [];
    
    // Add custom field
    if (showCustomField) {
      properties.push({ key: "custom_field", value: customFieldSearch });
    }
    
    // Add event types
    if (showEventType) {
      properties.push({ key: "event_type", value: Object.keys(eventTypes).filter((k) => eventTypes[k]) });
    }
    
    // Add outcomes
    if (showOutcomes) {
      properties.push({ key: "outcome", value: Object.keys(outcomes).filter((k) => outcomes[k]) });
    }
    
    // Add outcome flags
    if (showOutcomeFlags) {
      properties.push({
        key: "trigger_when_outcome_is",
        value: Object.keys(triggerOutcomeFlags).filter((k) => triggerOutcomeFlags[k]),
      });
    }
    
    // Add Contact by Status fields
    if (showContactByStatus) {
      if (finalStatus) {
        properties.push({ key: "Final Status", value: finalStatus });
      }
      if (waitSeconds) {
        properties.push({ key: "Wait Seconds", value: waitSeconds });
      }
      if (sendLastActiveStatus) {
        properties.push({ key: "Send Last Active Status", value: sendLastActiveStatus });
      }
    }
    
    // Add filters
    if (showFilters) {
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
    }
    
    const config = {
      nodeType: selectedTrigger,
      nodeName: triggerName || triggerMeta?.label,
      nodeIcon: "scheduler_trigger",
      nodeDescription: description,
      nodeData: {
        customFieldSearch,
        outcomes,
        eventTypes,
        triggerOutcomeFlags,
        ...(showContactByStatus ? {
          finalStatus,
          waitSeconds: waitSeconds ? parseInt(waitSeconds, 10) : undefined,
          sendLastActiveStatus,
        } : {}),
        ...(showFilters ? { filters: rows.filter(r => r.type).map(r => ({
          type: r.type,
          textValue: r.textValue || "",
          comparisonOperator: r.comparisonOperator || "Is",
          operator: r.operator || "AND"
        })) } : {}),
      },
      properties,
    };
    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
  };

  return (
    <div className="flex flex-col px-4">

      {/* Workflow trigger name */}
      <div className="flex flex-col gap-2 py-2">
        <div className="text-[13px] font-medium text-gray-700">WORKFLOW TRIGGER NAME</div>
        <Input
          placeholder="Enter name"
          className="h-8 text-[13px]"
          value={triggerName}
          onChange={(e) => setTriggerName(e.target.value)}
        />
      </div>

      <Separator className="px-4" />

      {/* Forms */}
      <div className="flex flex-col gap-4 py-4">
        {showCustomField && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-gray-900">Select Custom Field</h4>
            <Input
              placeholder="Search fields..."
              value={customFieldSearch}
              onChange={(e) => setCustomFieldSearch(e.target.value)}
            />
          </div>
        )}

        {showEventType && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-gray-900">Event Type <span className="text-red-500">*</span></h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  checked={eventTypes["Strategy Event"]}
                  onChange={() =>
                    setEventTypes((s) => ({ ...s, ["Strategy Event"]: !s["Strategy Event"] }))
                  }
                />
                <span>Strategy Event</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  checked={eventTypes["Discovery Event"]}
                  onChange={() =>
                    setEventTypes((s) => ({ ...s, ["Discovery Event"]: !s["Discovery Event"] }))
                  }
                />
                <span>Discovery Event</span>
              </label>
            </div>
          </div>
        )}

        {showOutcomes && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">outcome <span className="text-red-500">*</span></h4>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
              {/* Select All */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={Object.values(outcomes).every(v => v)}
                  onCheckedChange={(checked) => {
                    const newState = checked === true;
                    setOutcomes({
                      Sale: newState,
                      "No Sale": newState,
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

              {/* Sale */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={outcomes["Sale"]}
                  onCheckedChange={() => setOutcomes((s) => ({ ...s, Sale: !s.Sale }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Sale
                </span>
              </label>

              {/* No Sale */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={outcomes["No Sale"]}
                  onCheckedChange={() => setOutcomes((s) => ({ ...s, "No Sale": !s["No Sale"] }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  No Sale
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
        )}

        {showOutcomeFlags && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Trigger When Outcome is: <span className="text-red-500">*</span></h4>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
              {/* Select All */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={Object.values(triggerOutcomeFlags).every(v => v)}
                  onCheckedChange={(checked) => {
                    const newState = checked === true;
                    setTriggerOutcomeFlags({
                      Added: newState,
                      Updated: newState,
                    });
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  Select All
                </span>
              </label>

              {/* Added */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={triggerOutcomeFlags["Added"]}
                  onCheckedChange={() => setTriggerOutcomeFlags((s) => ({ ...s, Added: !s.Added }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Added
                </span>
              </label>

              {/* Updated */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={triggerOutcomeFlags["Updated"]}
                  onCheckedChange={() => setTriggerOutcomeFlags((s) => ({ ...s, Updated: !s.Updated }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Updated
                </span>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Trigger when an outcome is added to a new call or existing outcome of the call is updated.
            </p>
          </div>
        )}

        {showContactByStatus && (
          <div className="space-y-4">
            {/* Final Status */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>Final Status</span>
                <span className="text-red-500">*</span>
              </label>
              <Select value={finalStatus} onValueChange={setFinalStatus}>
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue placeholder="Select final status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POTENTIAL">Potential</SelectItem>
                  <SelectItem value="STRATEGY_CALL_BOOKED">Strategy Call Booked</SelectItem>
                  <SelectItem value="DISQUALIFIED">Disqualified</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="DISCOVERY_CALL_BOOKED">Discovery Call Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wait for X Seconds */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>Wait for X Seconds</span>
              </label>
              <Input
                type="number"
                placeholder="Enter seconds"
                value={waitSeconds}
                onChange={(e) => setWaitSeconds(e.target.value)}
                className="w-full bg-white"
              />
              <p className="text-xs text-gray-500">Time for contact to reach final status</p>
            </div>

            {/* Send Last Active Status */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>Send Last Active Status?</span>
              </label>
              <Select value={sendLastActiveStatus} onValueChange={setSendLastActiveStatus}>
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Send last active status, if contact left before reaching Final Status</p>
            </div>
          </div>
        )}

        <Separator className="bg-gray-200" />

        {/* Filters Section - Always at the bottom */}
        {showFilters && (
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
                        <SelectWithFilterPanel
                          value={row.type}
                          onValueChange={(value) => setRowType(row.id, value as FilterType)}
                          placeholder="Select filter type"
                          className="w-full bg-white border-gray-300"
                        />

                        {/* Comparison Operator */}
                        {row.type && (
                          <Select 
                            value={row.comparisonOperator || "Is"} 
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
                        {row.type && row.comparisonOperator !== "Is empty" && row.comparisonOperator !== "Is not empty" && (
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
        )}
      </div>

      <div className="absolute bottom-0 right-0 w-[30vw] border-top border-t border-gray-200 flex">
        <PrimaryButton disabled={isSaveDisabled} onClick={saveAction} isPrimary className="w-fit my-3 ml-auto mr-3">
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default GenericInboundSchedulerTrigger;


