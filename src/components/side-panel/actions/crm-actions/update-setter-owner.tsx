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

const UpdateSetterOwnerAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Setter Owner");
  const [inviteeEmailAddress, setInviteeEmailAddress] = useState(nodeData?.nodeData?.inviteeEmailAddress || "");
  const [setterEmailAddress, setSetterEmailAddress] = useState(nodeData?.nodeData?.setterEmailAddress || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_update_setter_owner",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Update setter ${setterEmailAddress} for invitee ${inviteeEmailAddress}`,
      nodeData: {
        inviteeEmailAddress,
        setterEmailAddress,
      },
      properties: [
        { key: "Invitee Email Address", value: inviteeEmailAddress },
        { key: "Setter Email Address", value: setterEmailAddress },
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = inviteeEmailAddress && setterEmailAddress;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Update Setter Owner</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Updates the setter owner of contact in iClosed.</p>
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

          {/* Invitee Email address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Invitee Email address
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter invitee email address"
              value={inviteeEmailAddress}
              onChange={setInviteeEmailAddress}
            />
          </div>

          {/* Setter Email address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Setter Email address
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter setter email address"
              value={setterEmailAddress}
              onChange={setSetterEmailAddress}
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

export default UpdateSetterOwnerAction;

