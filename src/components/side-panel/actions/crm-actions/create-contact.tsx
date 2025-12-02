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

const CreateContactAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Create a New Contact");
  const [emailAddress, setEmailAddress] = useState(nodeData?.nodeData?.emailAddress || "");
  const [phoneNumber, setPhoneNumber] = useState(nodeData?.nodeData?.phoneNumber || "");
  const [firstName, setFirstName] = useState(nodeData?.nodeData?.firstName || "");
  const [lastName, setLastName] = useState(nodeData?.nodeData?.lastName || "");
  const [eventName, setEventName] = useState(nodeData?.nodeData?.eventName || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_create_contact",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Create contact: ${emailAddress}`,
      nodeData: {
        emailAddress,
        phoneNumber,
        firstName,
        lastName,
        eventName,
      },
      properties: [
        { key: "Email Address", value: emailAddress },
        ...(phoneNumber ? [{ key: "Phone Number", value: phoneNumber }] : []),
        ...(firstName ? [{ key: "First Name", value: firstName }] : []),
        ...(lastName ? [{ key: "Last Name", value: lastName }] : []),
        ...(eventName ? [{ key: "Event Name", value: eventName }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = emailAddress;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Create a New Contact</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Creates a new contact in iClosed.</p>
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

          {/* Email Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Email address
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter email address"
              value={emailAddress}
              onChange={setEmailAddress}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Phone Number
            </label>
            <DynamicInput
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              First Name
            </label>
            <DynamicInput
              placeholder="Enter first name"
              value={firstName}
              onChange={setFirstName}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Last Name
            </label>
            <DynamicInput
              placeholder="Enter last name"
              value={lastName}
              onChange={setLastName}
            />
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Event Name
            </label>
            <DynamicInput
              placeholder="Enter event name"
              value={eventName}
              onChange={setEventName}
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

export default CreateContactAction;

