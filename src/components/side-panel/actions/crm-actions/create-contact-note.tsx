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
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const CreateContactNoteAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Create a New Contact Note");
  const [selectContact, setSelectContact] = useState(nodeData?.nodeData?.selectContact || "");
  const [emailAddress, setEmailAddress] = useState(nodeData?.nodeData?.emailAddress || "");
  const [note, setNote] = useState(nodeData?.nodeData?.note || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_create_contact_note",
      nodeName: actionName,
      nodeIcon: "add_note",
      nodeDescription: `Create note for contact: ${selectContact}`,
      nodeData: {
        selectContact,
        emailAddress,
        note,
      },
      properties: [
        { key: "Select Contact", value: selectContact },
        ...(emailAddress ? [{ key: "Email Address", value: emailAddress }] : []),
        { key: "Note", value: note },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = selectContact && note;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Create a New Contact Note</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Creates a new contact note in iClosed.</p>
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

          {/* Select Contact */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Select Contact
              <span className="text-red-500">*</span>
            </label>
            <Select value={selectContact} onValueChange={setSelectContact}>
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

          {/* Email Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Email address
            </label>
            <DynamicInput
              placeholder="Enter email address"
              value={emailAddress}
              onChange={setEmailAddress}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Note
              <span className="text-red-500">*</span>
            </label>
            <DynamicTextarea
              placeholder="Enter note"
              minHeight="100px"
              value={note}
              onChange={setNote}
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

export default CreateContactNoteAction;

