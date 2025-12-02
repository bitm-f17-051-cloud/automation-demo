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

const UpdateContactCustomFieldAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Contact Custom Field");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [customFieldId, setCustomFieldId] = useState(nodeData?.nodeData?.customFieldId || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_update_contact_custom_field",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Update custom field ${customFieldId} for contact ${contactId}`,
      nodeData: {
        contactId,
        customFieldId,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        { key: "Custom Field Id", value: customFieldId },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId && customFieldId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Update Contact Custom Field</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to update a contact custom field in iClosed.</p>
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

          {/* Custom Field Id */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Custom Field Id
              <span className="text-red-500">*</span>
            </label>
            <Select value={customFieldId} onValueChange={setCustomFieldId}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select or map a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom_field_1">Custom Field 1</SelectItem>
                <SelectItem value="custom_field_2">Custom Field 2</SelectItem>
                <SelectItem value="custom_field_3">Custom Field 3</SelectItem>
                <SelectItem value="trigger.custom_field_id">Trigger: Custom Field ID</SelectItem>
                <SelectItem value="previous_action.custom_field_id">Previous Action: Custom Field ID</SelectItem>
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

export default UpdateContactCustomFieldAction;

