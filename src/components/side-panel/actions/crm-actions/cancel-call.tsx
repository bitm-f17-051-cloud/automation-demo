/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
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
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const CancelCallAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Cancel Call");
  const [eventCallId, setEventCallId] = useState(nodeData?.nodeData?.eventCallId || "");
  const [cancelReason, setCancelReason] = useState(nodeData?.nodeData?.cancelReason || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_cancel_call",
      nodeName: actionName,
      nodeIcon: "call",
      nodeDescription: `Cancel call ${eventCallId}: ${cancelReason}`,
      nodeData: {
        eventCallId,
        cancelReason,
      },
      properties: [
        { key: "Event Call Id", value: eventCallId },
        { key: "Cancel Reason", value: cancelReason },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = eventCallId && cancelReason;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Cancel Call</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to cancel a call in iClosed.</p>
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

          {/* Event Call Id */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Event Call Id
              <span className="text-red-500">*</span>
            </label>
            <SelectWithVariablePanel
              value={eventCallId}
              onValueChange={setEventCallId}
              placeholder="Select or map a field"
              className="w-full h-12"
              variableOptions={[
                { value: "trigger.call_id", label: "Trigger: Call ID" },
                { value: "trigger.event_id", label: "Trigger: Event ID" },
                { value: "previous_action.call_id", label: "Previous Action: Call ID" },
              ]}
            />
          </div>

          {/* Cancel Reason */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Cancel Reason
              <span className="text-red-500">*</span>
            </label>
            <DynamicTextarea
              placeholder="Enter cancellation reason"
              minHeight="100px"
              value={cancelReason}
              onChange={setCancelReason}
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

export default CancelCallAction;

