/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const UnassignChatAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Un-Assign a chat");
  const [conversationId, setConversationId] = useState(nodeData?.nodeData?.conversationId || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "comm_unassign_chat",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Un-assign chat ${conversationId}`,
      nodeData: {
        conversationId,
      },
      properties: [
        { key: "Conversation ID", value: conversationId },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = conversationId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Un-Assign a chat</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Un-assign a chat conversation</p>
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

          {/* Conversation ID */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Conversation ID
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter conversation ID"
              value={conversationId}
              onChange={setConversationId}
            />
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

export default UnassignChatAction;

