/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
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
import { XIcon, Trash2, Plus, Copy } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

const InboundWebhookAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Outbound Webhook");
  const [method, setMethod] = useState<typeof HTTP_METHODS[number]>(
    nodeData?.nodeData?.method || "POST"
  );
  const [url, setUrl] = useState(
    nodeData?.nodeData?.url || "https://api.iclosed.com/webhook/abc123xyz"
  );
  const [customData, setCustomData] = useState<KeyValuePair[]>(
    nodeData?.nodeData?.customData || []
  );
  const [headers, setHeaders] = useState<KeyValuePair[]>(
    nodeData?.nodeData?.headers || []
  );
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

  const addCustomData = () => {
    setCustomData([...customData, { id: uuidv4(), key: "", value: "" }]);
  };

  const removeCustomData = (id: string) => {
    setCustomData(customData.filter((item) => item.id !== id));
  };

  const updateCustomData = (id: string, field: "key" | "value", newValue: string) => {
    setCustomData(
      customData.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const addHeader = () => {
    setHeaders([...headers, { id: uuidv4(), key: "", value: "" }]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((item) => item.id !== id));
  };

  const updateHeader = (id: string, field: "key" | "value", newValue: string) => {
    setHeaders(
      headers.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
  };

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "flow_inbound_webhook",
      nodeName: actionName,
      nodeIcon: "webhook",
      nodeDescription: `${method} request to ${url}`,
      nodeData: {
        method,
        url,
        authType,
        basicAuthUsername: authType === "basic_auth" ? basicAuthUsername : undefined,
        basicAuthPassword: authType === "basic_auth" ? basicAuthPassword : undefined,
        headerAuthName: authType === "header_auth" ? headerAuthName : undefined,
        headerAuthValue: authType === "header_auth" ? headerAuthValue : undefined,
        customData: customData.filter((item) => item.key),
        headers: headers.filter((item) => item.key),
      },
      properties: [
        { key: "Method", value: method },
        { key: "URL", value: url },
        { 
          key: "Authentication", 
          value: authType === "none" ? "None" : authType === "basic_auth" ? "Basic Auth" : "Header Auth" 
        },
        ...(customData.length > 0
          ? [{ key: "Custom Data", value: `${customData.length} items` }]
          : []),
        ...(headers.length > 0
          ? [{ key: "Headers", value: `${headers.length} items` }]
          : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Outbound Webhook</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Configure webhook settings</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Action Name</label>
            <Input
              placeholder="Enter action name"
              className="h-10 text-sm"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
            />
          </div>

          <Separator />

          {/* Method */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Method
            </label>
            <Select value={method} onValueChange={(value) => setMethod(value as typeof HTTP_METHODS[number])}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
              URL
            </label>
            <div className="relative">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-sm pr-10"
                placeholder="https://sample-url.com"
              />
              <button
                onClick={copyUrl}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copy URL"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

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

          <Separator />

          {/* Custom Data */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Custom Data
              </label>
              <p className="text-sm text-gray-500 mt-1">
                These custom key-value pairs will be included along with the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  standard data
                </a>
              </p>
            </div>

            {customData.map((item, index) => (
              <div key={item.id} className="space-y-2">
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) => updateCustomData(item.id, "key", e.target.value)}
                      className="h-10 text-sm"
                    />
                    <DynamicInput
                      placeholder="Value"
                      value={item.value}
                      onChange={(value) => updateCustomData(item.id, "value", value)}
                      className="h-10 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeCustomData(item.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addCustomData}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add item
            </button>
          </div>

          {/* Headers */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Headers
            </label>

            {headers.map((item, index) => (
              <div key={item.id} className="space-y-2">
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) => updateHeader(item.id, "key", e.target.value)}
                      className="h-10 text-sm"
                    />
                    <Input
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => updateHeader(item.id, "value", e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeHeader(item.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addHeader}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add item
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <PrimaryButton onClick={goBack} isPrimary={false}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={saveAction} isPrimary={true}>
          Save Action
        </PrimaryButton>
      </div>
    </div>
  );
};

export default InboundWebhookAction;

