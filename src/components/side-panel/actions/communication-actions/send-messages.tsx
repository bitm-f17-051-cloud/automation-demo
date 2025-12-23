/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useWorkflowStore } from "@/store/workflow.store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, XIcon, MessageSquare, Mail, Smartphone, Paperclip, Image, File, X } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

type Attachment = {
  id: string;
  name: string;
  type: "upload" | "media_library";
  url?: string;
  file?: File;
};

// Channel icon mapping
const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp_personal":
      return "whatsapp";
    case "gmail":
      return "gmail";
    case "linq":
      return "linq";
    case "sendblue":
      return "sendblue";
    case "whatsapp_cloud":
      return "whatsapp_cloud";
    default:
      return "add_note";
  }
};

// Channel display name
const getChannelName = (channel: string) => {
  switch (channel) {
    case "whatsapp_personal":
      return "WhatsApp Personal";
    case "gmail":
      return "Gmail";
    case "linq":
      return "Linq";
    case "sendblue":
      return "Sendblue (iMessage)";
    case "whatsapp_cloud":
      return "WhatsApp Cloud API";
    default:
      return channel;
  }
};

// Message presets
const MESSAGE_PRESETS = [
  { value: "welcome", label: "Welcome Message", content: "Hello! Welcome to our service. How can we help you today?" },
  { value: "thank_you", label: "Thank You", content: "Thank you for contacting us. We appreciate your business!" },
  { value: "follow_up", label: "Follow Up", content: "Hi! Just following up on our previous conversation. Is there anything else you need?" },
  { value: "appointment_reminder", label: "Appointment Reminder", content: "Reminder: You have an appointment scheduled. Please confirm your attendance." },
  { value: "custom_greeting", label: "Custom Greeting", content: "Hello {{contact.first_name}}! Thank you for reaching out. We're here to help." },
] as const;

// Mock media library items
const MOCK_MEDIA_LIBRARY = [
  { id: "media-1", name: "Company Logo.png", url: "/media/company-logo.png", type: "image" },
  { id: "media-2", name: "Product Brochure.pdf", url: "/media/product-brochure.pdf", type: "document" },
  { id: "media-3", name: "Welcome Image.jpg", url: "/media/welcome-image.jpg", type: "image" },
  { id: "media-4", name: "Terms and Conditions.pdf", url: "/media/terms.pdf", type: "document" },
  { id: "media-5", name: "FAQ Document.docx", url: "/media/faq.docx", type: "document" },
  { id: "media-6", name: "Contact Card.png", url: "/media/contact-card.png", type: "image" },
];

// Dummy attachments for presets
const PRESET_DUMMY_ATTACHMENTS: Attachment[] = [
  {
    id: "preset-att-1",
    name: "Company_Brochure.pdf",
    type: "media_library",
    url: "/media/preset-brochure.pdf",
  },
  {
    id: "preset-att-2",
    name: "Welcome_Banner.jpg",
    type: "media_library",
    url: "/media/preset-banner.jpg",
  },
];

const SendMessagesAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Send Messages");
  const [channel, setChannel] = useState(nodeData?.nodeData?.channel || "");
  // Auto-set account for Linq and Sendblue on initial load if channel is already selected
  const getInitialAccount = () => {
    const savedAccount = nodeData?.nodeData?.account || "";
    if (savedAccount) return savedAccount;
    if (nodeData?.nodeData?.channel === "linq") return "linq_default";
    if (nodeData?.nodeData?.channel === "sendblue") return "sendblue_default";
    return "";
  };
  const [account, setAccount] = useState(getInitialAccount());
  
  // Channel-specific fields
  // Gmail fields
  const [subject, setSubject] = useState(nodeData?.nodeData?.subject || "");
  const [body, setBody] = useState(nodeData?.nodeData?.body || "");
  const [gmailMessageType, setGmailMessageType] = useState<"preset" | "custom">(
    nodeData?.nodeData?.gmailMessageType || "custom"
  );
  const [selectedGmailPreset, setSelectedGmailPreset] = useState(nodeData?.nodeData?.selectedGmailPreset || "");
  
  // WhatsApp/Linq/Sendblue fields
  const [message, setMessage] = useState(nodeData?.nodeData?.message || "");
  const [messageType, setMessageType] = useState<"preset" | "custom">(
    nodeData?.nodeData?.messageType || "custom"
  );
  const [selectedPreset, setSelectedPreset] = useState(nodeData?.nodeData?.selectedPreset || "");
  
  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>(
    nodeData?.nodeData?.attachments || []
  );
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  // Backward compatibility: migrate old message field on initial load
  useEffect(() => {
    if (channel && nodeData?.nodeData) {
      const legacyMessage = nodeData.nodeData.message;
      
      if (legacyMessage) {
        if (channel === "gmail" && !body) {
          setBody(legacyMessage);
        } else if (!message) {
          setMessage(legacyMessage);
        }
      }
    }
  }, []); // Only run on mount

  // Fill Gmail body and add dummy attachments when preset is selected
  useEffect(() => {
    if (gmailMessageType === "preset" && selectedGmailPreset) {
      const preset = MESSAGE_PRESETS.find(p => p.value === selectedGmailPreset);
      if (preset) {
        setBody(preset.content);
        // Add dummy attachments for preset
        setAttachments(PRESET_DUMMY_ATTACHMENTS);
      }
    } else if (gmailMessageType === "custom") {
      // Clear preset attachments when switching to custom
      setAttachments([]);
    }
  }, [selectedGmailPreset, gmailMessageType]);

  // Fill message and add dummy attachments when preset is selected
  useEffect(() => {
    if (messageType === "preset" && selectedPreset) {
      const preset = MESSAGE_PRESETS.find(p => p.value === selectedPreset);
      if (preset) {
        setMessage(preset.content);
        // Add dummy attachments for preset
        setAttachments(PRESET_DUMMY_ATTACHMENTS);
      }
    } else if (messageType === "custom") {
      // Clear preset attachments when switching to custom
      setAttachments([]);
    }
  }, [selectedPreset, messageType]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: "upload" as const,
        file,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
    // Reset input
    event.target.value = "";
  };

  // Handle media library selection (mock for now)
  const handleMediaLibrarySelect = (mediaItem: { id: string; name: string; url: string }) => {
    const newAttachment: Attachment = {
      id: mediaItem.id,
      name: mediaItem.name,
      type: "media_library",
      url: mediaItem.url,
    };
    setAttachments([...attachments, newAttachment]);
    setShowMediaLibrary(false);
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  // Get account options based on selected channel
  const getAccountOptions = () => {
    switch (channel) {
      case "whatsapp_personal":
        return [
          { value: "account_1", label: "WhatsApp Account 1" },
          { value: "account_2", label: "WhatsApp Account 2" },
          { value: "trigger.account_id", label: "Trigger: Account ID" },
          { value: "previous_action.account_id", label: "Previous Action: Account ID" },
        ];
      case "gmail":
        return [
          { value: "gmail_1", label: "Gmail Account 1" },
          { value: "gmail_2", label: "Gmail Account 2" },
          { value: "trigger.gmail_account", label: "Trigger: Gmail Account" },
          { value: "previous_action.gmail_account", label: "Previous Action: Gmail Account" },
        ];
      case "linq":
        return [
          { value: "linq_default", label: "Linq Account" },
        ];
      case "sendblue":
        return [
          { value: "sendblue_default", label: "Sendblue Account" },
        ];
      case "whatsapp_cloud":
        return [
          { value: "whatsapp_cloud_1", label: "WhatsApp Cloud Account 1" },
          { value: "whatsapp_cloud_2", label: "WhatsApp Cloud Account 2" },
          { value: "trigger.whatsapp_cloud_account", label: "Trigger: WhatsApp Cloud Account" },
          { value: "previous_action.whatsapp_cloud_account", label: "Previous Action: WhatsApp Cloud Account" },
        ];
      default:
        return [];
    }
  };

  // Check if account field should be readonly
  const isAccountReadonly = channel === "linq" || channel === "sendblue";

  const saveAction = () => {
    if (!selectedNodeId) return;

    // Build nodeData based on channel type
    let nodeDataFields: any = {
      channel,
      account,
    };

    let properties: any[] = [
      { key: "Channel", value: getChannelName(channel) },
      { key: "Account", value: account },
    ];

    let description = `Send ${getChannelName(channel)} message`;

    if (channel === "gmail") {
      nodeDataFields.subject = subject;
      nodeDataFields.body = body;
      nodeDataFields.gmailMessageType = gmailMessageType;
      nodeDataFields.selectedGmailPreset = selectedGmailPreset;
      properties.push(
        { key: "Subject", value: subject },
        { key: "Body", value: body }
      );
      description = `Send Gmail message`;
    } else {
      // WhatsApp, Linq, Sendblue
      nodeDataFields.message = message;
      nodeDataFields.messageType = messageType;
      nodeDataFields.selectedPreset = selectedPreset;
      properties.push(
        { key: "Message", value: message }
      );
      description = `Send ${getChannelName(channel)} message`;
    }

    // Add attachments
    if (attachments.length > 0) {
      nodeDataFields.attachments = attachments.map((att) => ({
        id: att.id,
        name: att.name,
        type: att.type,
        url: att.url,
      }));
      properties.push(
        { key: "Attachments", value: `${attachments.length} file(s)` }
      );
    }

    const config = {
      nodeType: "comm_send_messages",
      nodeName: actionName,
      nodeIcon: getChannelIcon(channel),
      nodeDescription: description,
      nodeData: nodeDataFields,
      properties,
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  // Validation based on channel
  const isValid = () => {
    if (!channel || !account) return false;
    if (channel === "gmail") {
      if (gmailMessageType === "preset") {
        return subject && selectedGmailPreset && body;
      }
      return subject && body;
    } else {
      // WhatsApp, Linq, Sendblue
      if (messageType === "preset") {
        return selectedPreset && message;
      }
      return message;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Send Messages</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Send a message to a contact</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Action Name</label>
            <Input
              placeholder="Enter action name"
              className="h-10 text-sm"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
            />
          </div>

          <Separator className="bg-gray-200" />

          {/* Channel Selection Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Channel
                <span className="text-red-500">*</span>
              </label>
              <Select value={channel} onValueChange={(value) => {
                setChannel(value);
                // Auto-select account for Linq and Sendblue
                if (value === "linq") {
                  setAccount("linq_default");
                } else if (value === "sendblue") {
                  setAccount("sendblue_default");
                } else {
                  setAccount(""); // Reset account when channel changes
                }
                // Reset channel-specific fields when channel changes
                setSubject("");
                setBody("");
                setMessage("");
                setGmailMessageType("custom");
                setSelectedGmailPreset("");
                setMessageType("custom");
                setSelectedPreset("");
              }}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select messaging channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp_personal">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      WhatsApp Personal
                    </div>
                  </SelectItem>
                  <SelectItem value="gmail">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-600" />
                      Gmail
                    </div>
                  </SelectItem>
                  <SelectItem value="linq">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Linq
                    </div>
                  </SelectItem>
                  <SelectItem value="sendblue">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      Sendblue (iMessage)
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp_cloud">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-700" />
                      WhatsApp Cloud API
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account - Only shows when channel is selected */}
            {channel && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    Account
                    <span className="text-red-500">*</span>
                  </label>
                  <Select value={account} onValueChange={setAccount} disabled={isAccountReadonly}>
                    <SelectTrigger className={`w-full h-12 ${isAccountReadonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder={`Select ${getChannelName(channel)} account`} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAccountOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Channel-specific fields */}
          {channel && account && (
            <>
              <Separator className="bg-gray-200" />
              
              {/* Gmail Fields */}
              {channel === "gmail" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      Subject
                      <span className="text-red-500">*</span>
                    </label>
                    <DynamicInput
                      placeholder="Enter email subject or use variables"
                      value={subject}
                      onChange={setSubject}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      Body
                      <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Message Type Selection */}
                    <RadioGroup
                      value={gmailMessageType}
                      onValueChange={(value) => {
                        setGmailMessageType(value as "preset" | "custom");
                        if (value === "custom") {
                          setSelectedGmailPreset("");
                        }
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="preset" id="gmail-preset" />
                        <Label htmlFor="gmail-preset" className="text-sm font-normal cursor-pointer">
                          Message Preset
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="custom" id="gmail-custom" />
                        <Label htmlFor="gmail-custom" className="text-sm font-normal cursor-pointer">
                          Custom Message
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Preset Dropdown */}
                    {gmailMessageType === "preset" && (
                      <Select value={selectedGmailPreset} onValueChange={setSelectedGmailPreset}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Select a message preset" />
                        </SelectTrigger>
                        <SelectContent>
                          {MESSAGE_PRESETS.map((preset) => (
                            <SelectItem key={preset.value} value={preset.value}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Custom Message Textarea */}
                    {gmailMessageType === "custom" && (
                      <DynamicTextarea
                        placeholder="Enter email body or use variables like: Hello {{contact.first_name}}!"
                        minHeight="120px"
                        value={body}
                        onChange={setBody}
                      />
                    )}

                    {/* Preset Preview (readonly) */}
                    {gmailMessageType === "preset" && selectedGmailPreset && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{body}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WhatsApp/Linq/Sendblue Fields */}
              {(channel === "whatsapp_personal" || channel === "whatsapp_cloud" || channel === "linq" || channel === "sendblue") && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    Message
                    <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Message Type Selection */}
                  <RadioGroup
                    value={messageType}
                    onValueChange={(value) => {
                      setMessageType(value as "preset" | "custom");
                      if (value === "custom") {
                        setSelectedPreset("");
                      }
                    }}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="preset" id="message-preset" />
                      <Label htmlFor="message-preset" className="text-sm font-normal cursor-pointer">
                        Message Preset
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="message-custom" />
                      <Label htmlFor="message-custom" className="text-sm font-normal cursor-pointer">
                        Custom Message
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Preset Dropdown */}
                  {messageType === "preset" && (
                    <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select a message preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {MESSAGE_PRESETS.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Custom Message Textarea */}
                  {messageType === "custom" && (
                    <DynamicTextarea
                      placeholder="Enter message or use variables like: Hello {{contact.first_name}}!"
                      minHeight="120px"
                      value={message}
                      onChange={setMessage}
                    />
                  )}

                  {/* Preset Preview (readonly) */}
                  {messageType === "preset" && selectedPreset && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Attachments Section */}
              <Separator className="bg-gray-200" />
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  Attachments
                </label>
                
                {/* Attachment Options - Hide when preset is selected */}
                {((channel === "gmail" && gmailMessageType !== "preset") || 
                  ((channel === "whatsapp_personal" || channel === "whatsapp_cloud" || channel === "linq" || channel === "sendblue") && messageType !== "preset")) && (
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Attach Files</span>
                      </div>
                    </label>
                    
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Image className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Media Library</span>
                    </button>
                  </div>
                )}

                {/* Selected Attachments */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <div className="flex-shrink-0">
                          {attachment.type === "media_library" ? (
                            <Image className="w-5 h-5 text-blue-600" />
                          ) : (
                            <File className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.type === "media_library" ? "From Media Library" : "Uploaded File"}
                          </p>
                        </div>
                        {/* Hide remove button when preset is selected */}
                        {((channel === "gmail" && gmailMessageType !== "preset") || 
                          ((channel === "whatsapp_personal" || channel === "whatsapp_cloud" || channel === "linq" || channel === "sendblue") && messageType !== "preset")) && (
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <PrimaryButton onClick={goBack} isPrimary={false}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={saveAction} isPrimary={true} disabled={!isValid()}>
          Save Action
        </PrimaryButton>
      </div>

      {/* Media Library Dialog */}
      <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select from Media Library</DialogTitle>
            <DialogDescription>
              Choose a file from your media library to attach to the message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {MOCK_MEDIA_LIBRARY.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No media files available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {MOCK_MEDIA_LIBRARY.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleMediaLibrarySelect(item)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      {item.type === "image" ? (
                        <Image className="w-8 h-8 text-blue-600" />
                      ) : (
                        <File className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {item.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendMessagesAction;

