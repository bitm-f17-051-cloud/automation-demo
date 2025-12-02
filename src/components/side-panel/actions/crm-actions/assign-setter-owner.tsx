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

const AssignSetterOwnerAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Assign Setter Owner");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [closerId, setCloserId] = useState(nodeData?.nodeData?.closerId || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_assign_setter_owner",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Assign setter owner ${closerId} to contact ${contactId}`,
      nodeData: {
        contactId,
        closerId,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        { key: "Closer Id", value: closerId },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId && closerId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Assign Setter Owner</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to assign a Setter Owner to a Contact.</p>
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

          {/* Closer Id */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Closer Id
              <span className="text-red-500">*</span>
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

export default AssignSetterOwnerAction;

