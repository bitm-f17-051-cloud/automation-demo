/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  getTriggerByValue,
  SCHEDULING_STATUS,
} from "@/utils/side-panel/triggers/triggers.constants";
import {
  ChevronDownIcon,
  Clock,
  PlusIcon,
  RefreshCcwIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TriggersEnum } from "@/utils/side-panel/triggers/triggers.enum";
import PrimaryButton from "@/components/ui/primary-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useEvents } from "@/hooks/queries/useEvents";
import { DiscoveryEventIcon } from "@/components/assets/icons/events/discovery";
import { StrategyEventIcon } from "@/components/assets/icons/events/strategy";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getValueFromKeyValue } from "@/utils/common";

type ContactCreatedTriggerProps = {
  nodeData: { [key: string]: any } | undefined;
  goBack: () => void;
};

export const ContactCreatedEventProperties = (config: {
  [key: string]: any;
}) => {
  const { data: events } = useEvents();
  const properties = config.config.properties;

  if (!properties) return null;

  const eventType = properties.find(
    (property: any) => property.key === "Events"
  )?.value;
  const specificEvents = properties.find(
    (property: any) => property.key === "Specific Events"
  )?.value;
  const eventStatus = properties.find(
    (property: any) => property.key === "Scheduling Status Type"
  )?.value;
  const schedulingStatuses = properties.find(
    (property: any) => property.key === "Scheduling Status"
  )?.value;
  const filters = properties.find(
    (property: any) => property.key === "Filters"
  )?.value;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#6B7280] shrink-0 capitalize">Events:</span>
        {eventType === "all_events" && (
          <span className="text-gray-900 truncate capitalize">All events</span>
        )}
        {eventType === "specific_events" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-[6px] py-1 px-2.5 bg-[#F3F4F6]">
              <span>
                {events?.find((e: any) => e.id === specificEvents[0])
                  ?.eventType === "DISCOVERY_EVENT" ? (
                  <div className="flex items-center justify-center w-fit h-fit rounded-sm text-purple-800 bg-purple-100 p-0.5 border border-purple-300">
                    <DiscoveryEventIcon className="!size-3" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-fit h-fit rounded-sm text-blue-800 bg-blue-100 p-0.5 border border-blue-300">
                    <StrategyEventIcon className="!size-3" />
                  </div>
                )}
              </span>
              <span className="text-gray-900 truncate capitalize text-xs">
                {events?.find((e: any) => e.id === specificEvents[0])?.name}
              </span>
            </div>
            {specificEvents.length - 1 > 0 && <HoverCard>
              <HoverCardTrigger>
                <span
                  className="text-blue-800 truncate capitalize !text-xs bg-blue-100 rounded-full p-0.5 flex items-center justify-center"
                  style={{ aspectRatio: "1/1" }}
                >
                  +{specificEvents.length - 1}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="flex flex-col gap-2">
                {specificEvents?.slice(1).map((eventId: number) => {
                  const event = events?.find((e: any) => e.id === eventId);
                  if (!event) return null;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-1 rounded-[6px] py-1.5 px-2.5 bg-[#F3F4F6]"
                    >
                      <span>
                        {event.eventType === "DISCOVERY_EVENT" ? (
                          <div className="flex items-center justify-center w-fit h-fit rounded-md text-purple-800 bg-purple-100 p-1 border border-purple-300">
                            <DiscoveryEventIcon className="!size-4" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-fit h-fit rounded-md text-blue-800 bg-blue-100 p-1 border border-blue-300">
                            <StrategyEventIcon className="!size-4" />
                          </div>
                        )}
                      </span>
                      <span className="text-gray-900 truncate capitalize text-sm">
                        {event.name}
                      </span>
                    </div>
                  );
                })}
              </HoverCardContent>
            </HoverCard>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#6B7280] shrink-0 capitalize">Statuses:</span>
        {eventStatus === "any_status" && (
          <span className="text-gray-900 truncate capitalize">
            Any statuses
          </span>
        )}
        {eventStatus === "specific_status" && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 rounded-[6px] py-1 px-2.5 bg-[#F3F4F6]">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    SCHEDULING_STATUS[
                      schedulingStatuses[0] as keyof typeof SCHEDULING_STATUS
                    ].color,
                }}
              />
              <span className="text-gray-900 truncate capitalize !text-xs">
                {
                  SCHEDULING_STATUS[
                    schedulingStatuses[0] as keyof typeof SCHEDULING_STATUS
                  ].label
                }
              </span>
            </div>
            <HoverCard>
              <HoverCardTrigger>
                <span
                  className="text-blue-800 truncate capitalize !text-xs bg-blue-100 rounded-full p-0.5 flex items-center justify-center"
                  style={{ aspectRatio: "1/1" }}
                >
                  +{schedulingStatuses.length - 1}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="flex flex-col gap-2">
                {schedulingStatuses.slice(1).map((event: any) => (
                  <div
                    key={event}
                    className="flex items-center gap-1 rounded-[6px] py-1 px-2.5 bg-[#F3F4F6]"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          SCHEDULING_STATUS[
                            event as keyof typeof SCHEDULING_STATUS
                          ].color,
                      }}
                    />
                    <span className="text-gray-900 truncate capitalize !text-base">
                      {
                        SCHEDULING_STATUS[
                          event as keyof typeof SCHEDULING_STATUS
                        ].label
                      }
                    </span>
                  </div>
                ))}
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#6B7280] shrink-0 capitalize">
            {filters[0].type.split("_").join(" ")}:
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-gray-900 truncate capitalize text-xs">
                {filters[0].value === "exists" ? "Exists" : "Not Exists"}
              </span>
            </div>
            {filters.length - 1 > 0 && (
              <HoverCard>
                <HoverCardTrigger>
                  <span
                    className="text-blue-800 truncate capitalize !text-xs bg-blue-100 rounded-full p-0.5 flex items-center justify-center"
                    style={{ aspectRatio: "1/1" }}
                  >
                    +{filters.length - 1}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col gap-2">
                  {filters?.slice(1).map((filter: any, index: number) => {
                    return (
                      <div key={index} className="flex items-center gap-1">
                        <span className="text-[#6B7280] shrink-0 capitalize">
                          {filter.type.split("_").join(" ")}:
                        </span>
                        <span className="text-gray-900 truncate capitalize font-medium text-sm">
                          {filter.value === "exists"
                            ? "Exists"
                            : "Does not exist"}
                        </span>
                      </div>
                    );
                  })}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ContactCreatedTrigger = ({
  nodeData,
  goBack,
}: ContactCreatedTriggerProps) => {
  const { data: events } = useEvents();
  const selectedTriggerData = getTriggerByValue(TriggersEnum.CONTACT_CREATED);
  const IconComponent = selectedTriggerData?.icon;

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [eventType, setEventType] = useState<
    "all_events" | "specific_events" | ""
  >("");
  const [specificEvents, setSpecificEvents] = useState<string[]>([]);
  const [eventStatus, setEventStatus] = useState<
    "any_status" | "specific_status" | "none"
  >("none");
  const [schedulingStatuses, setSchedulingStatuses] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ type: string; value: string }[]>([]);
  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  useEffect(() => {
    if (
      (eventType === "all_events" ||
        (eventType === "specific_events" && specificEvents.length > 0)) 
        &&
      (eventStatus === "any_status" ||
        (eventStatus === "specific_status" && schedulingStatuses.length > 0))
    ) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [eventType, eventStatus, schedulingStatuses, specificEvents]);

  useEffect(() => {
    if (!nodeData) return;

    if (nodeData.nodeDescription) {
      setDescription(nodeData.nodeDescription);
    }

    const events = getValueFromKeyValue("Events", nodeData);
    setEventType(events);

    const specificEvents = getValueFromKeyValue("Specific Events", nodeData);
    setSpecificEvents(specificEvents);

    const eventStatus = getValueFromKeyValue(
      "Scheduling Status Type",
      nodeData
    );
    setEventStatus(eventStatus);

    const schedulingStatuses = getValueFromKeyValue(
      "Scheduling Status",
      nodeData
    );
    setSchedulingStatuses(schedulingStatuses);

    const filters = getValueFromKeyValue("Filters", nodeData);
    setFilters(filters);
  }, [nodeData]);

  const handleAddFilter = () => {
    setFilters([...filters, { type: "", value: "" }]);
  };

  const updateFilter = (index: number, type: string, value: string) => {
    setFilters([
      ...filters.slice(0, index),
      { type, value },
      ...filters.slice(index + 1),
    ]);
  };

  const saveTrigger = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: selectedTriggerData?.value,
      nodeName: selectedTriggerData?.label,
      nodeIcon: selectedTriggerData?.icon.name,
      nodeDescription: description,
      nodeData: {
        eventType,
        specificEvents,
        eventStatus,
        schedulingStatuses,
        filters,
      },
      properties: [
        {
          key: "Events",
          value: eventType,
        },
        {
          key: "Specific Events",
          value: specificEvents,
        },
        {
          key: "Scheduling Status Type",
          value: eventStatus,
        },
        {
          key: "Scheduling Status",
          value: schedulingStatuses,
        },
        {
          key: "Filters",
          value: filters,
        },
      ],
    };

    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
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
          {/* Description */}
          <div className="text-sm text-gray-500">Set up your trigger</div>
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
          <h4 className="text-sm font-medium text-gray-900">Event(s) *</h4>

          <div className="flex items-center gap-1.5">
            <Select
              value={eventType}
              onValueChange={(value) =>
                setEventType(value as "all_events" | "specific_events")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Select event(s)"
                  className="placeholder:text-gray-500 text-gray-900"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_events">All events</SelectItem>
                <SelectItem value="specific_events">Specific events</SelectItem>
              </SelectContent>
            </Select>
            {eventType === "specific_events" && (
              <Popover>
                <PopoverTrigger asChild>
                  <PrimaryButton
                    isPrimary={false}
                    className={`w-full flex !text-sm items-center justify-between border-input rounded-md ${
                      specificEvents.length === 0
                        ? "!text-muted-foreground"
                        : ""
                    }`}
                  >
                    {specificEvents.length > 0
                      ? `${specificEvents.length} events selected`
                      : "Select"}
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                  </PrimaryButton>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[calc(30dvw-32px)] mr-4">
                  <div className="p-2">
                    <div className="max-h-48 overflow-y-auto">
                      {events?.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50"
                        >
                          <Checkbox
                            className="cursor-pointer"
                            checked={specificEvents.includes(event.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSpecificEvents([
                                    ...specificEvents,
                                    event.id,
                                  ])
                                : setSpecificEvents(
                                    specificEvents?.filter(
                                      (value) => value !== event.id
                                    )
                                  );
                            }}
                          />

                          <div className="flex items-center gap-2">
                            {event.eventType === "DISCOVERY_EVENT" ? (
                              <div className="flex items-center justify-center w-fit h-fit rounded-md text-purple-800 bg-purple-100 p-[4px] border border-purple-300">
                                <DiscoveryEventIcon />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-fit h-fit rounded-md text-blue-800 bg-blue-100 p-[4px] border border-blue-300">
                                <StrategyEventIcon />
                              </div>
                            )}
                            <span className="text-sm text-gray-900 font-medium capitalize">
                              {event.name}
                            </span>
                          </div>
                          <div className="ml-auto text-xs font-medium pt-1 inline-flex items-center gap-1 rounded-[6px] py-1 px-2.5 bg-[#F3F4F6] text-gray-900 pr-3">
                            <Clock className="!size-3" />
                            {event.duration}{" "}
                            {event.durationUnit === "MINUTES"
                              ? "mins"
                              : "hours"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <RadioGroup
            className="flex items-center gap-4"
            value={eventStatus}
            onValueChange={(value) =>
              setEventStatus(value as "any_status" | "specific_status" | "none")
            }
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="any_status" id="r1" />
              <Label htmlFor="r1">Any status</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="specific_status" id="r2" />
              <Label htmlFor="r2">Specific status</Label>
            </div>
          </RadioGroup>
        </div>

        {eventStatus === "specific_status" && (
          <div className="flex flex-col gap-1.5">
            <h4 className="text-sm font-medium text-gray-900">
              Scheduling Status *
            </h4>
            <Popover>
              <PopoverTrigger asChild>
                <PrimaryButton
                  isPrimary={false}
                  className={`w-full flex !text-sm items-center justify-between border-input rounded-md ${
                    schedulingStatuses.length === 0
                      ? "!text-muted-foreground"
                      : ""
                  }`}
                >
                  {schedulingStatuses.length > 0
                    ? `${schedulingStatuses.length} statuses selected`
                    : "Select"}
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                </PrimaryButton>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[calc(30dvw-32px)] mr-4">
                <div className="p-2">
                  <div className="max-h-48 overflow-y-auto">
                    {Object.values(SCHEDULING_STATUS).map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50"
                      >
                        <Checkbox
                          className="cursor-pointer"
                          checked={schedulingStatuses.includes(status.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? setSchedulingStatuses([
                                  ...schedulingStatuses,
                                  status.value,
                                ])
                              : setSchedulingStatuses(
                                  schedulingStatuses?.filter(
                                    (value) => value !== status.value
                                  )
                                );
                          }}
                        />

                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full`}
                            style={{ backgroundColor: status.color }}
                          />
                          {status.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <Separator className="bg-gray-200" />

        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-medium text-gray-900">Filters</h4>
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <Select
                value={filter.type}
                onValueChange={(value) => updateFilter(index, value, "")}
              >
                <SelectTrigger
                  className={`${filter.type !== "" ? "w-2/3" : "w-full"}`}
                >
                  <SelectValue
                    placeholder="Filter Type"
                    className="placeholder:text-gray-500 text-gray-900"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact_phone">Contact Phone</SelectItem>
                  <SelectItem value="contact_email">Contact Email</SelectItem>
                  <SelectItem value="contact_name">Contact Name</SelectItem>
                  <SelectItem value="contact_company">
                    Contact Company
                  </SelectItem>
                  <SelectItem value="contact_title">Contact Title</SelectItem>
                  <SelectItem value="contact_city">Contact City</SelectItem>
                  <SelectItem value="contact_state">Contact State</SelectItem>
                  <SelectItem value="contact_country">
                    Contact Country
                  </SelectItem>
                </SelectContent>
              </Select>
              {filter.type !== "" && (
                <Select
                  value={filter.value}
                  onValueChange={(value) =>
                    updateFilter(index, filter.type, value)
                  }
                >
                  <SelectTrigger className={`w-1/3`}>
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
          Add Filter
        </PrimaryButton>
      </div>

      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton
          disabled={isSavedDisabled}
          onClick={saveTrigger}
          isPrimary={true}
          className="w-fit my-3 ml-auto mr-3"
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ContactCreatedTrigger;
