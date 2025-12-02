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
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const AssignChatAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Assign a chat");
  const [conversationId, setConversationId] = useState(nodeData?.nodeData?.conversationId || "");
  const [assignTo, setAssignTo] = useState(nodeData?.nodeData?.assignTo || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "comm_assign_chat",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Assign chat ${conversationId} to ${assignTo}`,
      nodeData: {
        conversationId,
        assignTo,
      },
      properties: [
        { key: "Conversation ID", value: conversationId },
        { key: "Assign To", value: assignTo },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = conversationId && assignTo;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Assign a chat</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Assign a chat conversation to a team member</p>
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

          {/* Assign To */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Assign To
              <span className="text-red-500">*</span>
            </label>
            <Select value={assignTo} onValueChange={setAssignTo}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user_1">User 1</SelectItem>
                <SelectItem value="user_2">User 2</SelectItem>
                <SelectItem value="user_3">User 3</SelectItem>
                <SelectItem value="trigger.user_id">Trigger: User ID</SelectItem>
                <SelectItem value="previous_action.user_id">Previous Action: User ID</SelectItem>
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

export default AssignChatAction;

