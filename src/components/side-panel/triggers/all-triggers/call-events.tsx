/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { getTriggerByValue } from "@/utils/side-panel/triggers/triggers.constants";
import { TriggersEnum } from "@/utils/side-panel/triggers/triggers.enum";
import { users } from "@/lib/mock-data";
import { UserIcon, PlusIcon, RefreshCcwIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import PrimaryButton from "@/components/ui/primary-button";

type CallEventsTriggerProps = {
  nodeData: { [key: string]: any } | undefined;
  goBack: () => void;
};

const CallEventsTrigger = ({ nodeData, goBack }: CallEventsTriggerProps) => {
  const selectedTriggerData = getTriggerByValue(TriggersEnum.CALL_EVENTS);
  const IconComponent = selectedTriggerData?.icon;

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [callType, setCallType] = useState("");
  const [assignedTo, setAssignedTo] = useState<"any_user" | "specific_user">("any_user");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [contactStage, setContactStage] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [filters, setFilters] = useState<{ type: string, value: string }[]>([]);
  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  useEffect(() => {
    if (description && callType && callStatus) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [description, callType, callStatus])

  const handleAddFilter = () => {
    setFilters([...filters, { type: "", value: "" }]);
  };

  const updateFilter = (index: number, type: string, value: string) => {
    setFilters([...filters.slice(0, index), { type, value }, ...filters.slice(index + 1)]);
  };

  useEffect(() => {
    console.log("🚀 ~ CallEventsTrigger ~ nodeData:", nodeData)
    if (!nodeData) return;

    if (nodeData.nodeDescription) {
      setDescription(nodeData.nodeDescription);
    }
    setCallType(nodeData.nodeData.callType);
    setAssignedTo(nodeData.nodeData.assignedTo);
    setSelectedUsers(nodeData.nodeData.selectedUsers);
    setContactStage(nodeData.nodeData.contactStage);
    setCallStatus(nodeData.nodeData.callStatus);
    setFilters(nodeData.nodeData.filters);
  }, [nodeData]);

  const saveTrigger = () => {
    if (!selectedNodeId) return;

    const selectedUsersData = users.filter(user => selectedUsers.includes(user.id));
    const assignedToValue = assignedTo === "any_user" ? "Any user" : 
      selectedUsersData.length > 0 ? `${selectedUsersData.length} users selected` : "No users selected";

    const config = {
      nodeType: selectedTriggerData?.value,
      nodeName: selectedTriggerData?.label,
      nodeIcon: selectedTriggerData?.icon.name,
      nodeDescription: description,
      nodeData: {
        callType,
        assignedTo,
        selectedUsers,
        contactStage,
        callStatus,
        filters
      },
      properties: [
        {
          key: "Call Type",
          value: callType
        },
        {
          key: "Assigned To",
          value: assignedToValue
        },
        ...(contactStage ? [{
          key: "Contact Stage",
          value: contactStage
        }] : []),
        {
          key: "Call Status",
          value: callStatus
        },
        ...filters.map((filter) => ({
          key: filter.type.split("_").join(" "),
          value: filter.value === "exists" ? "Exists" : "Not Exists"
        }))
      ]
    }

    updateNodeConfig(selectedNodeId, config);
  };

  return (
    <div className="flex flex-col px-4">
      {/* Header */}
      <div className="py-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {IconComponent && <IconComponent className="w-8 h-8" />}
              <h3>{selectedTriggerData?.label}</h3>
            </div>

            <div className="flex items-center gap-4">
              <PrimaryButton
                isPrimary={false}
                className="border-none cursor-pointer !p-0"
                onClick={goBack}
              >
                <RefreshCcwIcon
                  className="w-4 h-4 text-gray-500"
                  strokeWidth={3}
                />
              </PrimaryButton>
              <PrimaryButton
                isPrimary={false}
                className="border-none cursor-pointer !p-0 !pr-2"
                onClick={goBack}
              >
                <XIcon className="w-4 h-4 text-gray-500" strokeWidth={3} />
              </PrimaryButton>
            </div>
          </div>
          <div className="text-sm text-gray-500">Set up your trigger</div>
        </div>
        {/* Description */}
        <Input
          placeholder="Add a description for this node"
          className={`${
            !isDescriptionFocused ? "bg-gray-50" : "bg-white"
          } border-gray-200`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setIsDescriptionFocused(true)}
          onBlur={() => setIsDescriptionFocused(false)}
        />
      </div>

      <Separator className="px-4" />

      {/* Details */}
      <div className="flex flex-col gap-4 py-4">
        {/* Call Type */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Call type *</h4>
          <Select value={callType} onValueChange={(value) => setCallType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select"
                className="placeholder:text-gray-500 text-gray-900"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Discovery">Discovery</SelectItem>
              <SelectItem value="Strategy">Strategy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          {/* Assigned To */}
          <div className={`${assignedTo === "specific_user" ? "w-1/2" : "!w-full"} flex flex-col gap-1.5`}>
            <h4 className="text-sm font-medium text-gray-900">Assigned to</h4>
            <Select value={assignedTo} onValueChange={(value) => setAssignedTo(value as "any_user" | "specific_user")}>
              <SelectTrigger className={`w-full`}>
                <SelectValue
                  placeholder="Select"
                  className="placeholder:text-gray-500 text-gray-900"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_user">Any user</SelectItem>
                <SelectItem value="specific_user">Specific user</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select Users - Only show when specific user is selected */}
          {assignedTo === "specific_user" && (
            <div className="flex flex-col gap-1.5 w-1/2">
              <h4 className="text-sm font-medium text-gray-900">Select user(s)</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <PrimaryButton isPrimary={false} className="w-full flex items-center justify-between border-input rounded-md">
                    {selectedUsers.length > 0 ? `${selectedUsers.length} users selected` : "Select"}
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                  </PrimaryButton>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[calc(30dvw-32px)] mr-4">
                  <div className="p-2">
                    <Input 
                      placeholder="Search" 
                      className="mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {users.map((user) => (
                        <div 
                          key={user.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50"
                        >
                          <Checkbox
                            className="cursor-pointer"
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSelectedUsers([...selectedUsers, user.id])
                                : setSelectedUsers(
                                    selectedUsers?.filter(
                                      (value) => value !== user.id
                                    )
                                  )
                            }}
                          />
                          
                          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                            {!user.signedUrl && <UserIcon className="!size-4" />}
                            {user.signedUrl && <Image height={20} width={20} src={user.signedUrl!} alt={user.firstName} className="w-5 h-5 rounded-full object-cover" />}
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{user.firstName} {user.lastName}</span>
                          <span className="text-[13px] font-medium flex items-center justify-center text-gray-900 ml-auto border border-gray-200 rounded-md px-1.5 h-5 bg-gray-100">
                            {user.UserRoles[0]?.role?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Contact Stage */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Contact stage</h4>
          <Select value={contactStage} onValueChange={(value) => setContactStage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select"
                className="placeholder:text-gray-500 text-gray-900"
              />
            </SelectTrigger>
            <SelectContent>
              <div className="p-1">
                <div key="active-header" className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">Active</div>
                <SelectItem value="Follow up">
                  <div className="flex items-center gap-2">
                    📅 Follow up
                  </div>
                </SelectItem>
                <SelectItem value="Nurturing">
                  <div className="flex items-center gap-2">
                    🌱 Nurturing
                  </div>
                </SelectItem>
                <SelectItem value="Hot lead">
                  <div className="flex items-center gap-2">
                    🔥 Hot lead
                  </div>
                </SelectItem>
                <div key="won-header" className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide mt-2">Won</div>
                <SelectItem value="Customer">
                  <div className="flex items-center gap-2">
                    👤 Customer
                  </div>
                </SelectItem>
                <div key="lost-header" className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide mt-2">Lost</div>
                <SelectItem value="Cold lead">
                  <div className="flex items-center gap-2">
                    ❄️ Cold lead
                  </div>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Call Status */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Call status *</h4>
          <Select value={callStatus} onValueChange={(value) => setCallStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select"
                className="placeholder:text-gray-500 text-gray-900"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Call booked">Call booked</SelectItem>
              <SelectItem value="Call cancelled">Call cancelled</SelectItem>
              <SelectItem value="Call rescheduled">Call rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-200" />

        {/* Filters */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Filters</h4>
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-1">
              <Select value={filter.type} onValueChange={(value) => updateFilter(index, value, "")}>
                <SelectTrigger className={`${filter.type !== "" ? "w-2/3" : "w-full"}`}>
                  <SelectValue
                    placeholder="Filter Type"
                    className="placeholder:text-gray-500 text-gray-900"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact_phone">Contact Phone</SelectItem>
                  <SelectItem value="contact_email">Contact Email</SelectItem>
                  <SelectItem value="contact_name">Contact Name</SelectItem>
                  <SelectItem value="contact_company">Contact Company</SelectItem>
                  <SelectItem value="contact_title">Contact Title</SelectItem>
                  <SelectItem value="contact_city">Contact City</SelectItem>
                  <SelectItem value="contact_state">Contact State</SelectItem>
                  <SelectItem value="contact_country">Contact Country</SelectItem>
                </SelectContent>
              </Select>
              {filter.type !== "" && (
                <Select value={filter.value} onValueChange={(value) => updateFilter(index, filter.type, value)}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue
                      placeholder="Condition"
                      className="placeholder:text-gray-500 text-gray-900"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exists">Exists</SelectItem>
                    <SelectItem value="not_exists">Not Exists</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>

        <PrimaryButton 
          onClick={handleAddFilter} 
          isPrimary={false} 
          className="flex items-center gap-1.5 w-fit border-none !px-0 !text-blue-600 !text-sm !font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Add filter
        </PrimaryButton>
      </div>
      
      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton disabled={isSavedDisabled} onClick={saveTrigger} isPrimary={true} className="w-fit my-3 ml-auto mr-3">Save</PrimaryButton>
      </div>

    </div>
  );
};

export default CallEventsTrigger;