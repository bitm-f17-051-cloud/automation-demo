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
import { ChevronRight, XIcon, Globe, Info } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const SearchCallAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Search Call");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [date, setDate] = useState(nodeData?.nodeData?.date || "");
  const [type, setType] = useState(nodeData?.nodeData?.type || "");
  const [closerId, setCloserId] = useState(nodeData?.nodeData?.closerId || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "search_call",
      nodeName: actionName,
      nodeIcon: "call",
      nodeDescription: `Search call for contact ${contactId}`,
      nodeData: {
        contactId,
        date,
        type,
        closerId,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        ...(date ? [{ key: "Date", value: date }] : []),
        ...(type ? [{ key: "Type", value: type }] : []),
        ...(closerId ? [{ key: "Closer Id", value: closerId }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Search Call</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Search Call in iClosed by contactId, date, type and closer owner.</p>
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

          {/* Contact Id */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact Id
              <span className="text-red-500">*</span>
            </label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select or map a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trigger.contact_id">Trigger: Contact ID</SelectItem>
                <SelectItem value="trigger.user_id">Trigger: User ID</SelectItem>
                <SelectItem value="previous_action.contact_id">Previous Action: Contact ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Date
            </label>
            <DynamicInput
              placeholder="Enter date"
              value={date}
              onChange={setDate}
            />
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Time zone: Asia/Karachi</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  For more information about supported date formats, see the{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    online Help
                  </a>
                  .
                </span>
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="STRATEGY_EVENT">STRATEGY EVENT</SelectItem>
                <SelectItem value="DISCOVERY_EVENT">DISCOVERY EVENT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Closer Id */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Closer Id
            </label>
            <Select value={closerId} onValueChange={setCloserId}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select or map a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trigger.closer_id">Trigger: Closer ID</SelectItem>
                <SelectItem value="trigger.user_id">Trigger: User ID</SelectItem>
                <SelectItem value="previous_action.closer_id">Previous Action: Closer ID</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <PrimaryButton onClick={goBack} isPrimary={false}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={saveAction} isPrimary={true} disabled={!isValid}>
          Save Action
        </PrimaryButton>
      </div>
    </div>
  );
};

export default SearchCallAction;

