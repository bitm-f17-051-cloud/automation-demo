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
import { ChevronRight, XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const UpdateContactAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Contact");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [firstName, setFirstName] = useState(nodeData?.nodeData?.firstName || "");
  const [lastName, setLastName] = useState(nodeData?.nodeData?.lastName || "");
  const [email, setEmail] = useState(nodeData?.nodeData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(nodeData?.nodeData?.phoneNumber || "");
  const [secondaryPhoneNumber, setSecondaryPhoneNumber] = useState(nodeData?.nodeData?.secondaryPhoneNumber || "");
  const [secondaryEmail, setSecondaryEmail] = useState(nodeData?.nodeData?.secondaryEmail || "");
  const [schedulingStatus, setSchedulingStatus] = useState(nodeData?.nodeData?.schedulingStatus || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_update_contact",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Update contact: ${contactId}`,
      nodeData: {
        contactId,
        firstName,
        lastName,
        email,
        phoneNumber,
        secondaryPhoneNumber,
        secondaryEmail,
        schedulingStatus,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        ...(firstName ? [{ key: "First Name", value: firstName }] : []),
        ...(lastName ? [{ key: "Last Name", value: lastName }] : []),
        ...(email ? [{ key: "Email", value: email }] : []),
        ...(phoneNumber ? [{ key: "Phone Number", value: phoneNumber }] : []),
        ...(secondaryPhoneNumber ? [{ key: "Secondary Phone Number", value: secondaryPhoneNumber }] : []),
        ...(secondaryEmail ? [{ key: "Secondary Email", value: secondaryEmail }] : []),
        ...(schedulingStatus ? [{ key: "Scheduling Status", value: schedulingStatus }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Update Contact</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to update a contact in iClosed.</p>
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
            <SelectWithVariablePanel
              value={contactId}
              onValueChange={setContactId}
              placeholder="Select or map a field"
              className="w-full h-12"
              variableOptions={[
                { value: "trigger.contact_id", label: "Trigger: Contact ID" },
                { value: "trigger.user_id", label: "Trigger: User ID" },
                { value: "previous_action.contact_id", label: "Previous Action: Contact ID" },
              ]}
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

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Email
            </label>
            <DynamicInput
              placeholder="Enter email"
              value={email}
              onChange={setEmail}
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

          {/* Secondary PhoneNumber */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Secondary PhoneNumber
            </label>
            <DynamicInput
              placeholder="Enter secondary phone number"
              value={secondaryPhoneNumber}
              onChange={setSecondaryPhoneNumber}
            />
          </div>

          {/* Secondary Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Secondary Email
            </label>
            <DynamicInput
              placeholder="Enter secondary email"
              value={secondaryEmail}
              onChange={setSecondaryEmail}
            />
          </div>

          {/* Scheduling Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Scheduling Status
            </label>
            <Select value={schedulingStatus} onValueChange={setSchedulingStatus}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select scheduling status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="potential">POTENTIAL</SelectItem>
                <SelectItem value="strategy_call_booked">STRATEGY CALL BOOKED</SelectItem>
                <SelectItem value="qualified">QUALIFIED</SelectItem>
                <SelectItem value="disqualified">DISQUALIFIED</SelectItem>
                <SelectItem value="discovery_call_booked">DISCOVERY CALL BOOKED</SelectItem>
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

export default UpdateContactAction;

