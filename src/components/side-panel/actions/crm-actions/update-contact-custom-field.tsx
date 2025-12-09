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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronRight, XIcon, Search as SearchIcon, ChevronLeft, RefreshCw, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useObjectFields } from "@/hooks/queries/useObjectFields";
import { useVariableSelector } from "@/contexts/variable-selector-context";
import {
  ContactIcon,
  CallIcon,
  EventIcon,
  DealIcon,
  UserIcon,
} from "@/components/assets/icons/objects";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

// Object types for field selection
const OBJECT_TYPES = {
  CONTACT: "CONTACT",
  CALL: "CALL",
  EVENT: "EVENT",
  DEAL: "DEAL",
  USER: "USER",
} as const;

const ObjectTypeData = [
  {
    type: OBJECT_TYPES.CONTACT,
    name: "Contact",
    icon: ContactIcon,
  },
  {
    type: OBJECT_TYPES.CALL,
    name: "Call",
    icon: CallIcon,
  },
  {
    type: OBJECT_TYPES.EVENT,
    name: "Event",
    icon: EventIcon,
  },
  {
    type: OBJECT_TYPES.DEAL,
    name: "Deal",
    icon: DealIcon,
  },
  {
    type: OBJECT_TYPES.USER,
    name: "User",
    icon: UserIcon,
  },
];

const UpdateContactCustomFieldAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();
  const { openPanel } = useVariableSelector();
  
  const contactFields = useObjectFields(OBJECT_TYPES.CONTACT);
  const callFields = useObjectFields(OBJECT_TYPES.CALL);
  const eventFields = useObjectFields(OBJECT_TYPES.EVENT);
  const dealFields = useObjectFields(OBJECT_TYPES.DEAL);
  const userFields = useObjectFields(OBJECT_TYPES.USER);

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Update Field");
  const [contactId, setContactId] = useState(nodeData?.nodeData?.contactId || "");
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(
    nodeData?.nodeData?.objectType || null
  );
  const [selectedField, setSelectedField] = useState<any | null>(
    nodeData?.nodeData?.field || null
  );
  const [isFieldPopoverOpen, setIsFieldPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldValue, setFieldValue] = useState(nodeData?.nodeData?.fieldValue || "");

  // Helper function to get fields for a specific object type
  const getFieldsForObjectType = (objectType: string) => {
    switch (objectType) {
      case OBJECT_TYPES.CONTACT:
        return contactFields.data || [];
      case OBJECT_TYPES.CALL:
        return callFields.data || [];
      case OBJECT_TYPES.EVENT:
        return eventFields.data || [];
      case OBJECT_TYPES.DEAL:
        return dealFields.data || [];
      case OBJECT_TYPES.USER:
        return userFields.data || [];
      default:
        return [];
    }
  };

  // Initialize selected field from nodeData if objectType exists
  useEffect(() => {
    if (nodeData?.nodeData?.objectType && nodeData?.nodeData?.customFieldId && !selectedField) {
      const fields = getFieldsForObjectType(nodeData.nodeData.objectType);
      const field = fields.find(
        (f) => (f.slug || f.name) === nodeData.nodeData.customFieldId
      );
      if (field) {
        setSelectedField(field);
      }
    }
  }, [nodeData, contactFields.data, callFields.data, eventFields.data, dealFields.data, userFields.data]);

  // Get the field ID value (slug or name)
  const customFieldId = useMemo(() => {
    if (selectedField) {
      return selectedField.slug || selectedField.name;
    }
    return nodeData?.nodeData?.customFieldId || "";
  }, [selectedField, nodeData]);

  // Filter fields based on search query
  const filteredFields = useMemo(() => {
    if (!selectedObjectType) return [];
    const fields = getFieldsForObjectType(selectedObjectType);
    if (!searchQuery) return fields;
    return fields.filter((field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedObjectType, searchQuery, contactFields.data, callFields.data, eventFields.data, dealFields.data, userFields.data]);

  const saveAction = () => {
    if (!selectedNodeId) return;

    const fieldId = selectedField?.slug || selectedField?.name || "";

    const config = {
      nodeType: "crm_update_contact_custom_field",
      nodeName: actionName,
      nodeIcon: "add_update_fields",
      nodeDescription: `Update field ${fieldId} for contact ${contactId}`,
      nodeData: {
        contactId,
        customFieldId: fieldId,
        objectType: selectedObjectType,
        field: selectedField,
        fieldValue,
      },
      properties: [
        { key: "Contact Id", value: contactId },
        { key: "Fields", value: fieldId },
        { key: "Value", value: fieldValue },
        ...(selectedObjectType ? [{ key: "Object Type", value: selectedObjectType }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactId && customFieldId && fieldValue;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Update Field</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Action to update a contact field in iClosed.</p>
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

          {/* Fields */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Fields
              <span className="text-red-500">*</span>
            </label>
            <Popover open={isFieldPopoverOpen} onOpenChange={setIsFieldPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors h-12 ${
                    selectedField
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedField && selectedObjectType ? (
                      (() => {
                        const selectedObject = ObjectTypeData.find(obj => obj.type === selectedObjectType);
                        const IconComponent = selectedObject?.icon;
                        return (
                          <>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            <span className="font-medium">
                              {selectedObject?.name} / {selectedField.name}
                            </span>
                          </>
                        );
                      })()
                    ) : (
                      <span>Select field</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full" align="start">
                {!selectedObjectType ? (
                  <div className="p-0 pb-2">
                    <div className="p-3 relative">
                      <Input
                        placeholder="Search"
                        className="pl-[36px] py-1.5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <SearchIcon
                        className="w-4 h-4 text-gray-800 opacity-50 absolute left-6 top-1/2 -translate-y-1/2"
                        strokeWidth={3}
                      />
                    </div>
                    {ObjectTypeData?.map((object) => {
                      const filtered = !searchQuery || 
                        object.name.toLowerCase().includes(searchQuery.toLowerCase());
                      if (!filtered) return null;
                      return (
                        <div
                          key={object.type}
                          onClick={() => {
                            setSelectedObjectType(object.type);
                            setSearchQuery("");
                          }}
                          className="flex items-center justify-between px-[14px] py-1.5 hover:bg-blue-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <object.icon className="w-4 h-4" />
                            <span className="font-medium text-sm capitalize">
                              {object.name}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-800 opacity-50" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-0 pb-2">
                    <div className="flex items-center gap-1 p-3 pb-2">
                      <ChevronLeft
                        className="!size-5 text-gray-800 opacity-50 cursor-pointer"
                        onClick={() => {
                          setSelectedObjectType(null);
                          setSelectedField(null);
                          setSearchQuery("");
                        }}
                      />
                      <span className="font-medium text-sm capitalize">
                        {selectedObjectType?.toLowerCase()}
                      </span>
                    </div>
                    <div className="px-3 mb-3 relative">
                      <Input
                        placeholder="Search"
                        className="pl-[36px] py-1.5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <SearchIcon
                        className="!size-4 text-gray-500 opacity-50 absolute left-6 top-1/2 -translate-y-1/2"
                        strokeWidth={3}
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredFields.map((field) => (
                        <div
                          key={field.id}
                          onClick={() => {
                            setSelectedField(field);
                            setIsFieldPopoverOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-2 px-[14px] py-1.5 hover:bg-blue-50 cursor-pointer"
                        >
                          <span className="font-medium text-sm">
                            {field.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Value - Only show when a field is selected */}
          {selectedField && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Value
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter value or use variables"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  className="flex-1 h-12"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setTimeout(() => {
                      openPanel((variableValue) => {
                        setFieldValue(variableValue);
                      });
                    }, 0);
                  }}
                  className="flex-shrink-0 h-12 px-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Select variable"
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {fieldValue && (
                  <button
                    type="button"
                    onClick={() => setFieldValue("")}
                    className="flex-shrink-0 h-12 px-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title="Clear"
                  >
                    <XIcon className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
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

export default UpdateContactCustomFieldAction;

