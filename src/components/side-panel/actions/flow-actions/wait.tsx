/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Clock, CalendarIcon, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/store/workflow.store";
import { formatTo12Hour, getValueFromKeyValue } from "@/utils/common";
import { SCHEDULING_STATUS } from "@/utils/side-panel/triggers/triggers.constants";

type WaitActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

const WAIT_TYPES = {
  PERIOD_OF_TIME: {
    label: "A set period of time",
    description: "Wait for a specific time period"
  },
  SPECIFIC_DATE_TIME: {
    label: "Until a specific date and/or time",
    description: "e.g. December 10th at 09:00 AM"
  },
  CONTACT_STATUS_CHANGED: {
    label: "Wait for the contact status changed",
    description: "Wait until the contact status changes"
  },
  WAIT_FOR_REPLY: {
    label: "Wait for reply",
    description: "Wait until a contact replies to a message"
  }
} as const;

const WaitAction = ({ goBack, nodeData }: WaitActionProps) => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const nodes = useWorkflowStore((state) => state.nodes);
  
  // Check if "New Contact Created" trigger exists in the workflow
  const hasNewContactCreatedTrigger = nodes.some(
    (node) => node.type === "start" && node.data?.config?.nodeType === "inbound_watch_new_contacts"
  );

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Wait");
  const [description, setDescription] = useState(nodeData?.nodeDescription || "");
  
  // Wait type selection
  const [waitType, setWaitType] = useState<keyof typeof WAIT_TYPES | "">(
    nodeData?.nodeData?.waitType || ""
  );
  
  // Period of time
  const [duration, setDuration] = useState<number>(nodeData?.nodeData?.duration || 1);
  const [durationUnit, setDurationUnit] = useState<string>(nodeData?.nodeData?.durationUnit || "hours");
  
  // Specific date & time
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    nodeData?.nodeData?.date ? new Date(nodeData.nodeData.date) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(nodeData?.nodeData?.time || "09:00:00");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isWaitTypeOpen, setIsWaitTypeOpen] = useState(false);
  
  // Contact status changed wait type
  const [finalStatus, setFinalStatus] = useState<string>(
    nodeData?.nodeData?.finalStatus || ""
  );
  const [waitSeconds, setWaitSeconds] = useState<number>(
    nodeData?.nodeData?.waitSeconds || 0
  );
  
  // Wait for reply duration
  const [replyWaitDuration, setReplyWaitDuration] = useState<number>(
    nodeData?.nodeData?.replyWaitDuration || 1
  );
  const [replyWaitDurationUnit, setReplyWaitDurationUnit] = useState<string>(
    nodeData?.nodeData?.replyWaitDurationUnit || "hours"
  );

  // Check if form is valid
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    let isValid = false;

    if (waitType === "PERIOD_OF_TIME") {
      isValid = duration > 0 && Boolean(durationUnit);
    } else if (waitType === "SPECIFIC_DATE_TIME") {
      isValid = Boolean(selectedDate) && Boolean(selectedTime);
    } else if (waitType === "CONTACT_STATUS_CHANGED") {
      isValid = Boolean(finalStatus) && waitSeconds > 0;
    } else if (waitType === "WAIT_FOR_REPLY") {
      isValid = replyWaitDuration > 0 && Boolean(replyWaitDurationUnit);
    }

    setIsSaveDisabled(!isValid);
  }, [waitType, duration, durationUnit, selectedDate, selectedTime, finalStatus, waitSeconds, replyWaitDuration, replyWaitDurationUnit]);

  const saveAction = () => {
    if (!selectedNodeId || !waitType) return;

    let generatedDescription = description;
    
    // Generate description if not provided
    if (!description) {
      if (waitType === "PERIOD_OF_TIME") {
        generatedDescription = `Wait for ${duration} ${durationUnit}`;
      } else if (waitType === "SPECIFIC_DATE_TIME") {
        generatedDescription = `Wait until ${selectedDate?.toLocaleDateString()} at ${formatTo12Hour(selectedTime)}`;
      } else if (waitType === "CONTACT_STATUS_CHANGED") {
        const statusLabel = Object.values(SCHEDULING_STATUS).find(s => s.value === finalStatus)?.label || finalStatus;
        generatedDescription = `Wait for status: ${statusLabel} (max ${waitSeconds}s)`;
      } else if (waitType === "WAIT_FOR_REPLY") {
        generatedDescription = `Wait for reply (max ${replyWaitDuration} ${replyWaitDurationUnit})`;
      }
    }

    const config = {
      nodeName: actionName,
      nodeType: "wait",
      nodeIcon: "wait",
      nodeDescription: generatedDescription,
      nodeData: {
        waitType,
        duration,
        durationUnit,
        date: selectedDate?.toISOString(),
        time: selectedTime,
        finalStatus: waitType === "CONTACT_STATUS_CHANGED" ? finalStatus : undefined,
        waitSeconds: waitType === "CONTACT_STATUS_CHANGED" ? waitSeconds : undefined,
        replyWaitDuration: waitType === "WAIT_FOR_REPLY" ? replyWaitDuration : undefined,
        replyWaitDurationUnit: waitType === "WAIT_FOR_REPLY" ? replyWaitDurationUnit : undefined,
      },
      properties: [],
    };

    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={goBack}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Wait</h2>
              <p className="text-xs text-gray-500">Pause workflow execution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {/* Action Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Wait Name</Label>
            <Input
              placeholder="Enter wait name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Wait Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Wait Type</Label>
            <Popover open={isWaitTypeOpen} onOpenChange={setIsWaitTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {waitType ? WAIT_TYPES[waitType as keyof typeof WAIT_TYPES].label : "Select wait type"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white shadow-lg rounded-lg border border-gray-200" align="start">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setWaitType("PERIOD_OF_TIME");
                      setIsWaitTypeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                      waitType === "PERIOD_OF_TIME" ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {WAIT_TYPES.PERIOD_OF_TIME.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {WAIT_TYPES.PERIOD_OF_TIME.description}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWaitType("SPECIFIC_DATE_TIME");
                      setIsWaitTypeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                      waitType === "SPECIFIC_DATE_TIME" ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {WAIT_TYPES.SPECIFIC_DATE_TIME.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {WAIT_TYPES.SPECIFIC_DATE_TIME.description}
                    </div>
                  </button>
                  {/* Show this option only when "New Contact Created" trigger exists */}
                  {hasNewContactCreatedTrigger && (
                    <button
                      type="button"
                      onClick={() => {
                        setWaitType("CONTACT_STATUS_CHANGED");
                        setIsWaitTypeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                        waitType === "CONTACT_STATUS_CHANGED" ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {WAIT_TYPES.CONTACT_STATUS_CHANGED.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {WAIT_TYPES.CONTACT_STATUS_CHANGED.description}
                      </div>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setWaitType("WAIT_FOR_REPLY");
                      setIsWaitTypeOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                      waitType === "WAIT_FOR_REPLY" ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {WAIT_TYPES.WAIT_FOR_REPLY.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {WAIT_TYPES.WAIT_FOR_REPLY.description}
                    </div>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Period of Time Configuration */}
          {waitType === "PERIOD_OF_TIME" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Amount"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-1/2 bg-white"
                />
                <Select value={durationUnit} onValueChange={setDurationUnit}>
                  <SelectTrigger className="w-1/2 bg-white">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {duration > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Will wait for {duration} {durationUnit}
                </p>
              )}
            </div>
          )}

          {/* Specific Date & Time Configuration */}
          {waitType === "SPECIFIC_DATE_TIME" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              {/* Date Picker */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal bg-white"
                    >
                      {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Time</Label>
                <Input
                  type="time"
                  step="1"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white"
                />
              </div>

              {selectedDate && selectedTime && (
                <p className="text-xs text-gray-500 mt-2">
                  Will wait until {selectedDate.toLocaleDateString()} at {formatTo12Hour(selectedTime)}
                </p>
              )}
            </div>
          )}

          {/* Contact Status Changed Configuration */}
          {waitType === "CONTACT_STATUS_CHANGED" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
              {/* Final Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  Final Status
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={finalStatus} onValueChange={setFinalStatus}>
                  <SelectTrigger className="w-full bg-white border-gray-300">
                    <SelectValue placeholder="Select final status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SCHEDULING_STATUS).map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wait for X Seconds */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  Wait for X Seconds
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter seconds"
                  value={waitSeconds || ""}
                  onChange={(e) => setWaitSeconds(Number(e.target.value))}
                  className="w-full bg-white"
                />
                <p className="text-xs text-gray-500">
                  Time for contact to reach final status
                </p>
              </div>
            </div>
          )}

          {/* Wait for Reply Configuration */}
          {waitType === "WAIT_FOR_REPLY" && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Wait Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Amount"
                  value={replyWaitDuration}
                  onChange={(e) => setReplyWaitDuration(Number(e.target.value))}
                  className="w-1/2 bg-white"
                />
                <Select value={replyWaitDurationUnit} onValueChange={setReplyWaitDurationUnit}>
                  <SelectTrigger className="w-1/2 bg-white">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {replyWaitDuration > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Will wait for reply up to {replyWaitDuration} {replyWaitDurationUnit}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <Button 
          onClick={saveAction} 
          disabled={isSaveDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Wait Action
        </Button>
      </div>
    </div>
  );
};

export default WaitAction;
