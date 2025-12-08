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

const OUTCOME_OPTIONS = [
  { value: "WON", label: "WON" },
  { value: "NO_SALE", label: "NO SALE" },
] as const;

const AddCallOutcomeAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Add Call Outcome");
  const [eventCallId, setEventCallId] = useState(nodeData?.nodeData?.eventCallId || "");
  const [outcome, setOutcome] = useState(nodeData?.nodeData?.outcome || "");
  const [notes, setNotes] = useState(nodeData?.nodeData?.notes || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_add_call_outcome",
      nodeName: actionName,
      nodeIcon: "call",
      nodeDescription: `Add outcome ${outcome} to call ${eventCallId}`,
      nodeData: {
        eventCallId,
        outcome,
        notes,
      },
      properties: [
        { key: "Event Call Id", value: eventCallId },
        { key: "Outcome", value: outcome },
        ...(notes ? [{ key: "Notes", value: notes }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = eventCallId && outcome;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Add Call Outcome</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to add Call Outcome in iClosed.</p>
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
              ]}
            />
          </div>

          {/* Outcome */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Outcome
              <span className="text-red-500">*</span>
            </label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {OUTCOME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Notes
            </label>
            <DynamicTextarea
              placeholder="Add notes (optional)"
              minHeight="100px"
              value={notes}
              onChange={setNotes}
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

export default AddCallOutcomeAction;

