/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import VariableAutocomplete from "@/components/variable-autocomplete";
import VariableAutocompleteInput from "@/components/variable-autocomplete/input";
import { useUsers } from "@/hooks/queries";
import { useWorkflowStore } from "@/store/workflow.store";
import { getActionByValue } from "@/utils/side-panel/actions/actions.constants";
import { ActionsEnum } from "@/utils/side-panel/actions/actions.enum";
import { PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type SendMessageActionProps = {
  nodeData: { [key: string]: any; } | undefined;
  goBack: () => void;
};

const SendMessageAction = ({ nodeData, goBack }: SendMessageActionProps) => {

  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();

  const selectedActionData = getActionByValue(ActionsEnum.SEND_MESSAGE);
  const IconComponent = selectedActionData?.icon;

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const getValueFromKeyValue = (key: string) => {
    return nodeData?.properties.find((property: any) => property.key === key)?.value;
  }

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [channel, setChannel] = useState<"iMessage" | "SMS" | null>(null);
  const [recipient, setRecipient] = useState("");
  const [assignChatType, setAssignChatType] = useState<"any_user" | "specific_user" | null>(null);
  const [specificUser, setSpecificUser] = useState<any>(null);
  const [messagePreset, setMessagePreset] = useState<"none" | null>("none");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  useEffect(() => {
    if (description && channel && recipient && (assignChatType === "any_user" || (assignChatType === 'specific_user' && specificUser)) && messagePreset && message) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [description, channel, recipient, assignChatType, specificUser, messagePreset, message])
  // Setting the values from the node data
  useEffect(() => {
    if (selectedNodeId && nodeData) {
      setDescription(nodeData?.nodeDescription || "");
      setChannel(getValueFromKeyValue("Channel"));
      setRecipient(getValueFromKeyValue("Recipient"));
      setAssignChatType(getValueFromKeyValue("Assigned To") === null ? null : getValueFromKeyValue("Assigned To") === 'Any User' ? "any_user" : "specific_user");
      setSpecificUser(getValueFromKeyValue("Assigned To"));
      setMessagePreset(getValueFromKeyValue("Message Preset"));
      setMessage(getValueFromKeyValue("Message"));
      setFiles(getValueFromKeyValue("Add file(s)") || []);
    }
  }, [selectedNodeId, nodeData])

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: selectedActionData?.value,
      nodeName: selectedActionData?.label,
      nodeIcon: selectedActionData?.icon.name,
      nodeDescription: description,
      nodeData: {
        channel,
        recipient,
        assignChatType,
        specificUser,
        messagePreset,
        message,
        files
      },
      properties: [
        {
          key: "Channel",
          value: channel
        },
        {
          key: "Recipient",
          value: recipient
        },
        {
          key: "Assigned To",
          value: assignChatType === "any_user" ? "Any User" : specificUser
        },
        {
          key: "Message Preset",
          value: messagePreset
        },
        {
          key: "Message",
          value: message
        },
        {
          key: "Add file(s)",
          value: files
        }
      ]
    }

    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
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
              <h3>{selectedActionData?.label}</h3>
            </div>

            <div className="flex items-center gap-4">
              <PrimaryButton
                isPrimary={false}
                className="border-none cursor-pointer !p-0 !pr-2"
                onClick={goBack}
              >
                <XIcon className="w-4 h-4 text-gray-500" strokeWidth={3} />
              </PrimaryButton>
            </div>
          </div>
          {/* Description */}
          <div className="text-sm text-gray-500">Configure your action</div>
        </div>
        {/* Search */}
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
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Send message via *</h4>
          <Select value={channel ? channel : undefined} onValueChange={(value) => setChannel(value as "iMessage" | "SMS")}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select"
                className="placeholder:text-gray-500 text-gray-900"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iMessage">iMessage</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Send to</h4>
          <VariableAutocompleteInput
            value={recipient}
            onChange={setRecipient}
            placeholder="Enter number to select"
            currentNodeId={selectedNodeId!}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Assign chat to</h4>
          <div className="flex items-center gap-1">
            <Select value={assignChatType ? assignChatType : undefined} onValueChange={(value) => setAssignChatType(value as "any_user" | "specific_user")}>
              <SelectTrigger className={`${assignChatType === "specific_user" ? "w-1/3" : "w-full"}`}>
                <SelectValue
                  placeholder="Assign chat to"
                  className="placeholder:text-gray-500 text-gray-900"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any_user">Any User</SelectItem>
                <SelectItem value="specific_user">Specific User</SelectItem>
              </SelectContent>
            </Select>
            {assignChatType === "specific_user" && <Select value={specificUser ? specificUser : undefined} onValueChange={(value) => setSpecificUser(value)}>
              <SelectTrigger className={`w-2/3`}>
                <SelectValue
                  placeholder="Select User"
                />
              </SelectTrigger>
              <SelectContent>
                {users && users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        {user.signedUrl && <Image height={20} width={20} src={user.signedUrl!} alt={user.firstName} className="w-5 h-5 rounded-full object-cover" />}
                        <span className="text-sm font-medium text-gray-900 w-[-webkit-fill-available]">{user.firstName} {user.lastName}</span>
                      </div>

                      <div className="h-5 px-1.5 bg-gray-100 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-900">{user.UserRoles[0].role.name}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Message preset</h4>
          <Select value={messagePreset ? messagePreset : undefined} onValueChange={(value) => setMessagePreset(value as "none")}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select"
                className="placeholder:text-gray-500 text-gray-900"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            Message
            <span className="text-gray-600 text-sm font-normal">Use $ to add a custom field</span>
          </h4>
          <VariableAutocomplete
            value={message}
            onChange={setMessage}
            placeholder="e.g. Hello {{contact.firstName}}"
            currentNodeId={selectedNodeId!}
            triggerChars={['$']}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            Add file(s)
            <span className="text-gray-600 text-sm font-normal">(Optional)</span>
          </h4>
          <PrimaryButton isPrimary={false} className="w-full flex items-center gap-1.5 justify-center text-gray-900 text-sm font-medium">
            <PlusIcon className="w-4 h-4" />
            Add file
          </PrimaryButton>
        </div>

      </div>
      
      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton disabled={isSavedDisabled} onClick={saveAction} isPrimary={true} className="w-fit my-3 ml-auto mr-3">Save</PrimaryButton>
      </div>

    </div>
  );
};

export default SendMessageAction;