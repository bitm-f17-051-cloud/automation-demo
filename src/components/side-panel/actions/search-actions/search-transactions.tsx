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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const SearchTransactionsAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Search Transactions");
  const [name, setName] = useState(nodeData?.nodeData?.name || "");
  const [synced, setSynced] = useState(nodeData?.nodeData?.synced || "Empty");
  const [email, setEmail] = useState(nodeData?.nodeData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(nodeData?.nodeData?.phoneNumber || "");
  const [source, setSource] = useState(nodeData?.nodeData?.source || "");
  const [value, setValue] = useState(nodeData?.nodeData?.value || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "search_transactions",
      nodeName: actionName,
      nodeIcon: "deal",
      nodeDescription: `Search transaction: ${email || phoneNumber || name}`,
      nodeData: {
        name,
        synced,
        email,
        phoneNumber,
        source,
        value,
      },
      properties: [
        ...(name ? [{ key: "Name", value: name }] : []),
        ...(synced !== "Empty" ? [{ key: "Synced", value: synced }] : []),
        ...(email ? [{ key: "Email", value: email }] : []),
        ...(phoneNumber ? [{ key: "Phone Number", value: phoneNumber }] : []),
        ...(source ? [{ key: "Source", value: source }] : []),
        ...(value ? [{ key: "Value", value: value }] : []),
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
          <h2 className="text-base font-semibold text-gray-900">Search Transactions</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Search transaction by email or Phone Number.</p>
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

          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Name
            </label>
            <DynamicInput
              placeholder="Enter name"
              value={name}
              onChange={setName}
            />
            <p className="text-xs text-gray-500 pt-1">
              The name to use in the search query. For example,{" "}
              <span className="text-pink-500">John Doe</span>.
            </p>
          </div>

          {/* Synced */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Synced
            </label>
            <RadioGroup value={synced} onValueChange={setSynced}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Yes" id="synced-yes" />
                  <Label htmlFor="synced-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="No" id="synced-no" />
                  <Label htmlFor="synced-no" className="font-normal cursor-pointer">No</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Empty" id="synced-empty" />
                  <Label htmlFor="synced-empty" className="font-normal cursor-pointer">Empty</Label>
                </div>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500 pt-1">
              Whether the entry is synced. Use <span className="text-pink-500">true</span> or{" "}
              <span className="text-pink-500">false</span>.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Email
            </label>
            <DynamicInput
              placeholder="Enter email"
              value={email}
              onChange={setEmail}
            />
            <p className="text-xs text-gray-500 pt-1">
              Email address to filter by. For example,{" "}
              <span className="text-pink-500">john@example.com</span>.
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Phone Number
            </label>
            <DynamicInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
            <p className="text-xs text-gray-500 pt-1">
              Phone number to filter by. For example,{" "}
              <span className="text-pink-500">+1234567890</span>.
            </p>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Source
            </label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRM">CRM</SelectItem>
                <SelectItem value="web">web</SelectItem>
                <SelectItem value="mobile">mobile</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="import">Import</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 pt-1">
              The source of the data. For example,{" "}
              <span className="text-pink-500">CRM</span>,{" "}
              <span className="text-pink-500">web</span>, etc.
            </p>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Value
            </label>
            <DynamicInput
              placeholder="Enter value"
              value={value}
              onChange={setValue}
            />
            <p className="text-xs text-gray-500 pt-1">
              A custom value to use in the search or filter criteria.
            </p>
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

export default SearchTransactionsAction;

