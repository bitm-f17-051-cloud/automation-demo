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
import { SelectWithVariablePanel } from "@/components/ui/select-with-variable-panel";
import { ChevronRight, XIcon, RefreshCw, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// Dummy team members data
const DUMMY_TEAM_MEMBERS = [
  { id: "user_1", name: "Alex Thompson", email: "alex.thompson@example.com" },
  { id: "user_2", name: "Maria Garcia", email: "maria.garcia@example.com" },
  { id: "user_3", name: "James Miller", email: "james.miller@example.com" },
  { id: "user_4", name: "Sophia Martinez", email: "sophia.martinez@example.com" },
  { id: "user_5", name: "William Taylor", email: "william.taylor@example.com" },
  { id: "user_6", name: "Olivia Anderson", email: "olivia.anderson@example.com" },
  { id: "user_7", name: "Michael Jackson", email: "michael.jackson@example.com" },
  { id: "user_8", name: "Emma White", email: "emma.white@example.com" },
];

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const AssignChatAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Assign a chat");
  const [conversationId, setConversationId] = useState(nodeData?.nodeData?.conversationId || "");
  const [selectionType, setSelectionType] = useState<"round_robin" | "specific_assignee">(
    nodeData?.nodeData?.selectionType || "specific_assignee"
  );
  const [assignTo, setAssignTo] = useState(nodeData?.nodeData?.assignTo || "");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    nodeData?.nodeData?.selectedAssignees || []
  );

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "comm_assign_chat",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: selectionType === "round_robin" 
        ? `Assign chat ${conversationId} (round robin)`
        : `Assign chat ${conversationId} to ${assignTo}`,
      nodeData: {
        conversationId,
        selectionType,
        assignTo: selectionType === "specific_assignee" ? assignTo : undefined,
        selectedAssignees: selectionType === "round_robin" ? selectedAssignees : undefined,
      },
      properties: [
        { key: "Conversation ID", value: conversationId },
        { key: "Selection Type", value: selectionType === "round_robin" ? "Round Robin" : "Specific Assignee" },
        ...(selectionType === "round_robin" 
          ? [{ key: "Assignees", value: selectedAssignees.join(", ") }]
          : [{ key: "Assign To", value: assignTo }]
        ),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = conversationId && (
    selectionType === "round_robin" 
      ? selectedAssignees.length > 0 
      : assignTo
  );

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

          {/* Selection Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Selection Type
              <span className="text-red-500">*</span>
            </label>
            <Select value={selectionType} onValueChange={(value) => setSelectionType(value as "round_robin" | "specific_assignee")}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="specific_assignee">Specific Assignee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assign To */}
          {selectionType === "round_robin" ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Assignees
                <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full h-12 flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                    <span className={selectedAssignees.length === 0 ? "text-gray-500" : ""}>
                      {selectedAssignees.length > 0
                        ? `${selectedAssignees.length} assignee${selectedAssignees.length > 1 ? "s" : ""} selected`
                        : "Select assignees"}
                    </span>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full">
                  <div className="p-2">
                    <div className="max-h-48 overflow-y-auto">
                      {DUMMY_TEAM_MEMBERS.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            if (selectedAssignees.includes(member.id)) {
                              setSelectedAssignees(selectedAssignees.filter(id => id !== member.id));
                            } else {
                              setSelectedAssignees([...selectedAssignees, member.id]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={selectedAssignees.includes(member.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAssignees([...selectedAssignees, member.id]);
                              } else {
                                setSelectedAssignees(selectedAssignees.filter(id => id !== member.id));
                              }
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <span>{member.name}</span>
                            <span className="text-xs text-gray-500">({member.email})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Assign To
                <span className="text-red-500">*</span>
              </label>
              <SelectWithVariablePanel
                value={assignTo}
                onValueChange={setAssignTo}
                placeholder="Select team member"
                className="w-full h-12"
                displayValue={assignTo ? DUMMY_TEAM_MEMBERS.find(m => m.id === assignTo)?.name : undefined}
                triggerContent={<RefreshCw className="w-4 h-4 text-gray-400" />}
              />
            </div>
          )}
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

