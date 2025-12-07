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
import { ChevronRight, XIcon, RefreshCw, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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

// Dummy setter owners data
const DUMMY_SETTER_OWNERS = [
  { id: "setter_1", name: "Alex Thompson", email: "alex.thompson@example.com" },
  { id: "setter_2", name: "Maria Garcia", email: "maria.garcia@example.com" },
  { id: "setter_3", name: "James Miller", email: "james.miller@example.com" },
  { id: "setter_4", name: "Sophia Martinez", email: "sophia.martinez@example.com" },
  { id: "setter_5", name: "William Taylor", email: "william.taylor@example.com" },
  { id: "setter_6", name: "Olivia Anderson", email: "olivia.anderson@example.com" },
  { id: "setter_7", name: "Michael Jackson", email: "michael.jackson@example.com" },
  { id: "setter_8", name: "Emma White", email: "emma.white@example.com" },
];

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const UpdateSetterOwnerAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Setter Owner");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [selectionType, setSelectionType] = useState<"round_robin" | "specific_setter">(
    nodeData?.nodeData?.selectionType || "specific_setter"
  );
  const [setterOwnerId, setSetterOwnerId] = useState(nodeData?.nodeData?.setterOwnerId || "");
  const [selectedSetters, setSelectedSetters] = useState<string[]>(
    nodeData?.nodeData?.selectedSetters || []
  );

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_update_setter_owner",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: selectionType === "round_robin" 
        ? `Update setter owners (round robin) for contact ${contactId}`
        : `Update setter owner ${setterOwnerId} for contact ${contactId}`,
      nodeData: {
        contactId,
        selectionType,
        setterOwnerId: selectionType === "specific_setter" ? setterOwnerId : undefined,
        selectedSetters: selectionType === "round_robin" ? selectedSetters : undefined,
      },
      properties: [
        { key: "Contact", value: contactId },
        { key: "Selection Type", value: selectionType === "round_robin" ? "Round Robin" : "Specific Setter" },
        ...(selectionType === "round_robin" 
          ? [{ key: "Setter Owners", value: selectedSetters.join(", ") }]
          : [{ key: "Setter Owner", value: setterOwnerId }]
        ),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId && (
    selectionType === "round_robin" 
      ? selectedSetters.length > 0 
      : setterOwnerId
  );

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

          {/* Contact */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact
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

          {/* Selection Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Selection Type
              <span className="text-red-500">*</span>
            </label>
            <Select value={selectionType} onValueChange={(value) => setSelectionType(value as "round_robin" | "specific_setter")}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="specific_setter">Specific Setter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Setter Owner */}
          {selectionType === "round_robin" ? (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Setter Owners
                <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full h-12 flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                    <span className={selectedSetters.length === 0 ? "text-gray-500" : ""}>
                      {selectedSetters.length > 0
                        ? `${selectedSetters.length} setter${selectedSetters.length > 1 ? "s" : ""} selected`
                        : "Select setter owners"}
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
                      {DUMMY_SETTER_OWNERS.map((setter) => (
                        <div
                          key={setter.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            if (selectedSetters.includes(setter.id)) {
                              setSelectedSetters(selectedSetters.filter(id => id !== setter.id));
                            } else {
                              setSelectedSetters([...selectedSetters, setter.id]);
                            }
                          }}
                        >
                          <Checkbox
                            checked={selectedSetters.includes(setter.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSetters([...selectedSetters, setter.id]);
                              } else {
                                setSelectedSetters(selectedSetters.filter(id => id !== setter.id));
                              }
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <span>{setter.name}</span>
                            <span className="text-xs text-gray-500">({setter.email})</span>
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
                Setter Owner
                <span className="text-red-500">*</span>
              </label>
              <Select value={setterOwnerId} onValueChange={setSetterOwnerId}>
                <SelectTrigger className="w-full h-12">
                  <div className="flex items-center justify-between w-full">
                    <SelectValue placeholder="Select or map a field" />
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {DUMMY_SETTER_OWNERS.map((setter) => (
                    <SelectItem key={setter.id} value={setter.id}>
                      <div className="flex items-center gap-2">
                        <span>{setter.name}</span>
                        <span className="text-xs text-gray-500">({setter.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default UpdateSetterOwnerAction;

