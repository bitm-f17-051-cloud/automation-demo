/* eslint-disable @typescript-eslint/no-explicit-any */

import PrimaryButton from "@/components/ui/primary-button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import {
  getActionByValue,
  WAIT_CONDITIONS,
} from "@/utils/side-panel/actions/actions.constants";
import {
  ActionsEnum,
  WAIT_EVENT_BASED_CONDITIONS,
} from "@/utils/side-panel/actions/actions.enum";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatTo12Hour, getValueFromKeyValue } from "@/utils/common";

type WaitActionProps = {
  nodeData: { [key: string]: any } | undefined;
  goBack: () => void;
};

const WaitAction = ({ nodeData, goBack }: WaitActionProps) => {
  const selectedActionData = getActionByValue("flow_wait");
  const IconComponent = selectedActionData?.icon;

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  const [selectedCondition, setSelectedCondition] = useState<
    keyof typeof WAIT_CONDITIONS | null
  >(null);
  const [isConditionOpen, setIsConditionOpen] = useState(false);

  const [waitFor, setWaitFor] = useState<number>(0);
  const [waitForUnit, setWaitForUnit] = useState<string>("mins");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("09:00:00");

  const [selectedEventBasedCondition, setSelectedEventBasedCondition] =
    useState<keyof typeof WAIT_EVENT_BASED_CONDITIONS | null>(null);

  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  useEffect(() => {
    let isValid = false;

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.PERIOD_OF_TIME
    ) {
      isValid = waitFor > 0 && Boolean(waitForUnit);
    }

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.EVENT_BASED
    ) {
      isValid =
        Boolean(selectedEventBasedCondition) &&
        waitFor > 0 &&
        Boolean(waitForUnit);
    }

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.SPECIFIC_DATE_TIME
    ) {
      isValid = Boolean(date);
    }

    setIsSavedDisabled(!isValid);
  }, [
    selectedCondition,
    waitFor,
    waitForUnit,
    selectedEventBasedCondition,
    date,
  ]);
  // Setting the values from the node data
  useEffect(() => {
    if (selectedNodeId && nodeData) {
      setDescription(nodeData?.nodeDescription || "");
      const savedWaitCondition = getValueFromKeyValue(
        "Wait condition",
        nodeData
      );
      const savedWaitFor = getValueFromKeyValue("Wait for", nodeData);
      const savedWaitForUnit = getValueFromKeyValue("Wait for unit", nodeData);
      const savedEventBasedCondition = getValueFromKeyValue(
        "Event based condition",
        nodeData
      );

      setSelectedCondition(
        (savedWaitCondition as keyof typeof WAIT_CONDITIONS) || null
      );
      setWaitFor(savedWaitFor !== undefined ? Number(savedWaitFor) : 0);
      setWaitForUnit(savedWaitForUnit || "mins");
      setSelectedEventBasedCondition(
        (savedEventBasedCondition as keyof typeof WAIT_EVENT_BASED_CONDITIONS) ||
          null
      );

      const savedDate = getValueFromKeyValue("Specific date time", nodeData);
      const savedTime = getValueFromKeyValue("Specific time", nodeData);
      setDate(savedDate ? new Date(savedDate) : undefined);
      setTime(savedTime || "09:00:00");
    }
  }, [selectedNodeId, nodeData]);

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: selectedActionData?.value,
      nodeName: selectedActionData?.label,
      nodeIcon: selectedActionData?.icon.name,
      nodeDescription: description,
      nodeData: {
        waitCondition: selectedCondition,
        waitFor,
        waitForUnit,
        eventBasedCondition: selectedEventBasedCondition,
        date,
        time: selectedCondition && WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.SPECIFIC_DATE_TIME ? time : null,
      }
    };

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.PERIOD_OF_TIME
    ) {
      config.nodeDescription = `Wait for ${waitFor} ${waitForUnit}`;
    }

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.SPECIFIC_DATE_TIME
    ) {
      config.nodeDescription = `Wait until ${date?.toLocaleDateString()} - ${formatTo12Hour(
        time
      )}`;
    }

    if (
      selectedCondition &&
      WAIT_CONDITIONS[selectedCondition] === WAIT_CONDITIONS.EVENT_BASED
    ) {
      if (selectedEventBasedCondition === "NO_CALL_BOOKED_IN_TIMEFRAME") {
        config.nodeDescription = `No call booked in ${waitFor} ${waitForUnit}`;
      } else {
        config.nodeDescription = `${waitFor} ${waitForUnit} ${
          WAIT_EVENT_BASED_CONDITIONS[
            (selectedEventBasedCondition as keyof typeof WAIT_EVENT_BASED_CONDITIONS) ||
              ""
          ]
        }`;
      }
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
          <h4 className="text-sm font-medium text-gray-900">Wait condition</h4>
          <Popover open={isConditionOpen} onOpenChange={setIsConditionOpen}>
            <PopoverTrigger asChild>
              <PrimaryButton
                isPrimary={false}
                className="w-full flex items-center justify-between border-input rounded-md"
              >
                {selectedCondition
                  ? WAIT_CONDITIONS[selectedCondition].label
                  : "Select"}
                <ChevronDownIcon
                  className={`${
                    isConditionOpen ? "rotate-180" : ""
                  } w-4 h-4 text-muted-foreground opacity-50`}
                />
              </PrimaryButton>
            </PopoverTrigger>
            <PopoverContent className="py-2 px-0 w-[calc(30dvw-32px)]">
              {Object.entries(WAIT_CONDITIONS).map(([key, condition]) => (
                <div
                  key={condition.label}
                  className="flex flex-col gap-1 px-4 py-1.5 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setSelectedCondition(key as keyof typeof WAIT_CONDITIONS);
                    setIsConditionOpen(false);
                  }}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {condition.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {condition.description}
                  </span>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {selectedCondition &&
          WAIT_CONDITIONS[selectedCondition] ===
            WAIT_CONDITIONS.PERIOD_OF_TIME && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm font-medium text-gray-900">Wait for</h4>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  placeholder="Enter the number of days"
                  className="w-1/2"
                  value={waitFor}
                  onChange={(e) => setWaitFor(Number(e.target.value))}
                />
                <Select
                  defaultValue="mins"
                  value={waitForUnit}
                  onValueChange={setWaitForUnit}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select the unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="mins">Mins</SelectItem>
                    <SelectItem value="secs">Secs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

        {selectedCondition &&
          WAIT_CONDITIONS[selectedCondition] ===
            WAIT_CONDITIONS.SPECIFIC_DATE_TIME && (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <div className="flex flex-col gap-1.5 w-2/3">
                  <Label
                    htmlFor="date-picker"
                    className="text-sm font-medium text-gray-900"
                  >
                    Date
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-full justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-1.5 w-1/3">
                  <Label
                    htmlFor="time-picker"
                    className="text-sm font-medium text-gray-900"
                  >
                    Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    defaultValue="09:00:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

        {selectedCondition &&
          WAIT_CONDITIONS[selectedCondition] ===
            WAIT_CONDITIONS.EVENT_BASED && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-sm font-medium text-gray-900">Condition</h4>
              <Select
                value={
                  selectedEventBasedCondition
                    ? selectedEventBasedCondition
                    : undefined
                }
                onValueChange={(value) =>
                  setSelectedEventBasedCondition(
                    value as keyof typeof WAIT_EVENT_BASED_CONDITIONS
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the condition" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WAIT_EVENT_BASED_CONDITIONS).map(
                    ([key, condition]) => (
                      <SelectItem key={key} value={key}>
                        {condition}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {selectedEventBasedCondition && (
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    placeholder="Enter the number of days"
                    className="w-1/2"
                    value={waitFor}
                    onChange={(e) => setWaitFor(Number(e.target.value))}
                  />
                  <Select value={waitForUnit} onValueChange={setWaitForUnit}>
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Select the unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="mins">Mins</SelectItem>
                      <SelectItem value="secs">Secs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
      </div>

      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton
          disabled={isSavedDisabled}
          onClick={saveAction}
          isPrimary={true}
          className="w-fit my-3 ml-auto mr-3"
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default WaitAction;
