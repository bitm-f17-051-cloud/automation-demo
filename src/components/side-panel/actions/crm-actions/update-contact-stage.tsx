/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
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
import { ChevronRight, XIcon, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { useObjectFields } from "@/hooks/queries/useObjectFields";

// Dummy contacts data
const DUMMY_CONTACTS = [
  { id: "contact_1", name: "John Doe", email: "john.doe@example.com" },
  { id: "contact_2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "contact_3", name: "Mike Johnson", email: "mike.johnson@example.com" },
  { id: "contact_4", name: "Sarah Williams", email: "sarah.williams@example.com" },
  { id: "contact_5", name: "David Brown", email: "david.brown@example.com" },
  { id: "contact_6", name: "Emily Davis", email: "emily.davis@example.com" },
  { id: "contact_7", name: "Robert Wilson", email: "robert.wilson@example.com" },
  { id: "contact_8", name: "Lisa Anderson", email: "lisa.anderson@example.com" },
];

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const UpdateContactStageAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();
  const { data: contactFields } = useObjectFields('CONTACT');

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Contact Stage");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [contactStage, setContactStage] = useState(nodeData?.nodeData?.contactStage || "");

  // Get contact stage field and its options
  const contactStageField = useMemo(() => {
    if (!contactFields) return null;
    return contactFields.find(field => field.slug === 'contact_stage' || field.name === 'Contact Stage');
  }, [contactFields]);

  const contactStageOptions = useMemo(() => {
    if (!contactStageField?.CustomFieldOptions) return [];
    return contactStageField.CustomFieldOptions
      .filter(option => !option.isArchived)
      .sort((a, b) => (a.displayIndex || 0) - (b.displayIndex || 0));
  }, [contactStageField]);

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_update_contact_stage",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Update contact stage to ${contactStage} for contact ${contactId}`,
      nodeData: {
        contactId,
        contactStage,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        { key: "Contact Stage", value: contactStage },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId && contactStage;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Update Contact Stage</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to update the contact stage in iClosed.</p>
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
                <div className="flex items-center justify-between w-full">
                  <SelectValue placeholder="Select or map a field" />
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {DUMMY_CONTACTS.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center gap-2">
                      <span>{contact.name}</span>
                      <span className="text-xs text-gray-500">({contact.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Stage */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact Stage
              <span className="text-red-500">*</span>
            </label>
            <Select value={contactStage} onValueChange={setContactStage}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select contact stage" />
              </SelectTrigger>
              <SelectContent>
                {contactStageOptions.map((option) => (
                  <SelectItem key={option.id} value={option.name}>
                    <div className="flex items-center gap-2">
                      {option.icon && <span>{option.icon}</span>}
                      <span>{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
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

export default UpdateContactStageAction;

