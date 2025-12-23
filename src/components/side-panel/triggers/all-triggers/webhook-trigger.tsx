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
import { XIcon, Trash2, Plus, Sparkles, Copy } from "lucide-react";
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

const WebhookTrigger = ({ goBack, nodeData, selectedTrigger }: Props) => {
  const triggerMeta = getTriggerByValue(selectedTrigger);
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [triggerName, setTriggerName] = useState<string>(nodeData?.nodeName || triggerMeta?.label || "");

  // Dummy webhook URL
  const webhookUrl = "https://api.iclosed.com/webhook/abc123xyz";

  // Authentication state
  const [authType, setAuthType] = useState<"none" | "basic_auth" | "header_auth">(
    nodeData?.nodeData?.authType || "none"
  );
  // Basic Auth fields
  const [basicAuthUsername, setBasicAuthUsername] = useState<string>(
    nodeData?.nodeData?.basicAuthUsername || ""
  );
  const [basicAuthPassword, setBasicAuthPassword] = useState<string>(
    nodeData?.nodeData?.basicAuthPassword || ""
  );
  // Header Auth fields
  const [headerAuthName, setHeaderAuthName] = useState<string>(
    nodeData?.nodeData?.headerAuthName || ""
  );
  const [headerAuthValue, setHeaderAuthValue] = useState<string>(
    nodeData?.nodeData?.headerAuthValue || ""
  );
  // Sample payload state
  const [samplePayload, setSamplePayload] = useState<string>(
    nodeData?.nodeData?.samplePayload || ""
  );
  const [payloadError, setPayloadError] = useState<string>("");

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
  };

  // Validate JSON payload
  const validateJSON = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setPayloadError("");
      return true;
    }
    try {
      JSON.parse(jsonString);
      setPayloadError("");
      return true;
    } catch (error) {
      setPayloadError("Invalid JSON format");
      return false;
    }
  };

  const handlePayloadChange = (value: string) => {
    setSamplePayload(value);
    validateJSON(value);
  };

  const saveAction = () => {
    if (!selectedNodeId) return;
    
    // Validate sample payload before saving
    if (samplePayload.trim() && !validateJSON(samplePayload)) {
      return; // Don't save if JSON is invalid
    }
    
    const properties: Array<{ key: string; value: any }> = [];
    
    // Add webhook URL
    properties.push({ key: "webhook_url", value: webhookUrl });
    
    // Add filters
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
    
    // Add Authentication property
    const authDisplayValue = 
      authType === "none" ? "None" :
      authType === "basic_auth" ? "Basic Auth" :
      "Header Auth";
    properties.push({ 
      key: "Authentication", 
      value: authDisplayValue
    });
    
    // Add Sample Payload property if exists
    if (samplePayload.trim()) {
      properties.push({ 
        key: "Sample Payload", 
        value: "Configured"
      });
    }
    
    const config = {
      nodeType: selectedTrigger,
      nodeName: triggerName || triggerMeta?.label,
      nodeIcon: "webhook_trigger",
      nodeDescription: "",
      nodeData: {
        webhookUrl,
        filters: filters,
        authType,
        basicAuthUsername: authType === "basic_auth" ? basicAuthUsername : undefined,
        basicAuthPassword: authType === "basic_auth" ? basicAuthPassword : undefined,
        headerAuthName: authType === "header_auth" ? headerAuthName : undefined,
        headerAuthValue: authType === "header_auth" ? headerAuthValue : undefined,
        samplePayload: samplePayload.trim() || undefined,
      },
      properties,
    };
    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
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

        {/* Webhook URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            URL (POST/GET/PUT)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={webhookUrl}
              readOnly
              className="w-full bg-gray-50 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Copy URL"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500">This URL is read-only. Use it to send webhook events to this workflow.</p>
        </div>

        <Separator className="bg-gray-200" />

        {/* Authentication */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Authentication
          </label>
          <Select value={authType} onValueChange={(value) => setAuthType(value as "none" | "basic_auth" | "header_auth")}>
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="basic_auth">Basic Auth</SelectItem>
              <SelectItem value="header_auth">Header Auth</SelectItem>
            </SelectContent>
          </Select>

          {/* Basic Auth Configuration */}
          {authType === "basic_auth" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input
                  value={basicAuthUsername}
                  onChange={(e) => setBasicAuthUsername(e.target.value)}
                  className="h-10 text-sm"
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  value={basicAuthPassword}
                  onChange={(e) => setBasicAuthPassword(e.target.value)}
                  className="h-10 text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>
          )}

          {/* Header Auth Configuration */}
          {authType === "header_auth" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Header Name</label>
                <Input
                  value={headerAuthName}
                  onChange={(e) => setHeaderAuthName(e.target.value)}
                  className="h-10 text-sm"
                  placeholder="e.g., X-API-Key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Header Value</label>
                <Input
                  type="password"
                  value={headerAuthValue}
                  onChange={(e) => setHeaderAuthValue(e.target.value)}
                  className="h-10 text-sm"
                  placeholder="Enter header value"
                />
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200" />

        {/* Sample Payload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sample Payload
          </label>
          <div className="space-y-1">
            <textarea
              value={samplePayload}
              onChange={(e) => handlePayloadChange(e.target.value)}
              placeholder='{"example": "payload", "data": "here"}'
              className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                payloadError ? "border-red-300 focus:ring-red-500" : "border-gray-300"
              }`}
              rows={8}
            />
            {payloadError && (
              <p className="text-xs text-red-600">{payloadError}</p>
            )}
            <p className="text-xs text-gray-500">
              Enter a sample JSON payload to test your webhook trigger
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200" />

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

export default WebhookTrigger;

