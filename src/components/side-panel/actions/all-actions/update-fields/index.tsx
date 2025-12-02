/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectField } from "@/app/api/objects/route";
import {
  CallIcon,
  ContactIcon,
  DealIcon,
  EventIcon,
  UserIcon,
} from "@/components/assets/icons/objects";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useObjectFields, User } from "@/hooks/queries";
import { FieldIconRenderer } from "@/lib/field-icon-mapping";
import { useWorkflowStore } from "@/store/workflow.store";
import { getActionByValue } from "@/utils/side-panel/actions/actions.constants";
import {
  ActionsEnum,
  OBJECT_TYPES,
} from "@/utils/side-panel/actions/actions.enum";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import RadioFieldOptions from "./radio.field";
import SingleSelectFieldOptions from "./single-select.field";
import MultipleSelectFieldOptions from "./multiple-select.field";
import DateFieldOptions from "./date.field";
import UserFieldOptions from "./user.field";
import { format } from "date-fns";

type UpdateFieldsActionProps = {
  nodeData: { [key: string]: any } | undefined;
  goBack: () => void;
};

// Define the structure for field values
interface FieldValue {
  id: string;
  objectType: OBJECT_TYPES | null;
  field: ObjectField | null;
  radioOption?: string | null;
  checkboxOptions?: string[];
  singleSelectOption?: string | null;
  multiSelectOptions?: string[];
  textValue?: string | null;
  numberValue?: number | null;
  date?: Date | null;
  time?: string | null;
  dateOpen?: boolean;
  userOption?: User | null;
  userSelectionType?: "round_robin" | "select_manually" | undefined;
}

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

const UpdateFieldsAction = ({ nodeData, goBack }: UpdateFieldsActionProps) => {
  const selectedActionData = getActionByValue(ActionsEnum.UPDATE_FIELDS);
  const IconComponent = selectedActionData?.icon;

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  const [fieldValues, setFieldValues] = useState<FieldValue[]>([]);

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const contactFields = useObjectFields(OBJECT_TYPES.CONTACT);
  const callFields = useObjectFields(OBJECT_TYPES.CALL);
  const eventFields = useObjectFields(OBJECT_TYPES.EVENT);
  const dealFields = useObjectFields(OBJECT_TYPES.DEAL);
  const userFields = useObjectFields(OBJECT_TYPES.USER);

  // Helper function to get fields for a specific object type
  const getFieldsForObjectType = (objectType: OBJECT_TYPES) => {
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

  // Helper functions to manage field values
  const addNewFieldDropdown = () => {
    const fieldId = `field-${Date.now()}`;
    const newFieldValue: FieldValue = {
      id: fieldId,
      objectType: null,
      field: null,
      radioOption: null,
      checkboxOptions: [],
      singleSelectOption: null,
      multiSelectOptions: [],
      date: null,
      time: null,
      dateOpen: false,
      userOption: null,
      userSelectionType: undefined,
    };
    setFieldValues((prev) => [...prev, newFieldValue]);
  };

  const updateFieldObjectType = (fieldId: string, objectType: OBJECT_TYPES) => {
    updateFieldValue(fieldId, { objectType, field: null });
  };

  const updateFieldSelection = (fieldId: string, field: ObjectField) => {
    updateFieldValue(fieldId, { field });
  };

  const updateFieldValue = (fieldId: string, updates: Partial<FieldValue>) => {
    setFieldValues((prev) =>
      prev.map((fv) => (fv.id === fieldId ? { ...fv, ...updates } : fv))
    );
  };

  const removeField = (fieldId: string) => {
    setFieldValues((prev) => prev.filter((fv) => fv.id !== fieldId));
  };

  useEffect(() => {
    if (fieldValues.length > 0) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [fieldValues]);

  // Setting the values from the node data
  useEffect(() => {
    if (selectedNodeId && nodeData) {
      setDescription(nodeData?.nodeDescription || "");
      setFieldValues(nodeData?.nodeData?.fieldValues || []);
    }
  }, [selectedNodeId, nodeData]);

  const saveAction = () => {
    if (!selectedNodeId) return;
    const fieldsWithSelections = fieldValues.filter(
      (fieldValue) => fieldValue.field !== null
    );

    const properties = fieldsWithSelections
      .map((fieldValue) => {
        const { field, ...values } = fieldValue;

        let actualValue = null;
        switch (field!.inputType) {
          case "TEXT":
            actualValue = values.textValue;
            break;
          case "RADIO_BUTTON":
            actualValue = values.radioOption;
            break;
          case "NUMBER":
            actualValue = values.numberValue;
            break;
          case "CHECK_BOX":
            actualValue = values.checkboxOptions;
            break;
          case "SINGLE_SELECT":
            actualValue = values.singleSelectOption;
            break;
          case "MULTIPLE_SELECT":
            actualValue = values.multiSelectOptions;
            break;
          case "DATE":
            actualValue = {
              date: values.date,
              time: values.time,
            };
            break;
          case "USER":
            actualValue = {
              user: values.userOption,
              selectionType: values.userSelectionType,
            };
            break;
          default:
            actualValue = null;
        }

        const property = {
          key: `${fieldValue.objectType?.toLowerCase()} / ${field!.name.toLowerCase()}`,
          value:
            typeof actualValue === "object" && actualValue !== null
              ? (() => {
                  if (
                    field!.inputType === "DATE" &&
                    actualValue &&
                    typeof actualValue === "object"
                  ) {
                    const { date, time } = actualValue as {
                      date?: Date | string | null;
                      time?: string | null;
                    };
                    if (date) {
                      let dateObj: Date;
                      if (typeof date === "string") {
                        dateObj = new Date(date);
                      } else if (date instanceof Date) {
                        dateObj = date;
                      } else {
                        return "";
                      }
                      if (time) {
                        const [hours, minutes, seconds] = time
                          .split(":")
                          .map(Number);
                        dateObj.setHours(
                          hours || 0,
                          minutes || 0,
                          seconds || 0,
                          0
                        );
                      }
                      return format(dateObj, "MMM dd, yyyy - hh:mmaaa");
                    }
                    return "";
                  }
                  if (
                    field!.inputType === "USER" &&
                    actualValue &&
                    typeof actualValue === "object"
                  ) {
                    const { user } = actualValue as { user?: User };
                    return user?.firstName + " " + user?.lastName || "";
                  }
                  if (
                    (field!.inputType === "CHECK_BOX" ||
                      field!.inputType === "MULTIPLE_SELECT") &&
                    actualValue &&
                    Array.isArray(actualValue)
                  ) {
                    return actualValue?.join(", ") || [];
                  }
                  return JSON.stringify(actualValue);
                })()
              : typeof actualValue === "string"
              ? actualValue.charAt(0).toUpperCase() +
                actualValue.slice(1).toLowerCase()
              : actualValue,
        };
        return property;
      })
      .filter((property) => {
        if (property.value === null || property.value === undefined)
          return false;

        if (Array.isArray(property.value)) {
          return property.value.length > 0;
        }

        if (typeof property.value === "object" && property.value !== null) {
          return Object.values(property.value).some(
            (val) => val !== null && val !== undefined
          );
        }

        return true;
      });

    const config = {
      nodeType: selectedActionData?.value,
      nodeName: selectedActionData?.label,
      nodeIcon: selectedActionData?.icon.name,
      nodeDescription: description,
      nodeData: {
        fieldValues,
      },
      properties,
    };
    console.log("🚀 ~ saveAction ~ config:", config);

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
          <h4 className="text-sm font-medium text-gray-900">Fields</h4>

          {/* Render each field dropdown */}
          <div className="flex flex-col gap-4">
            {fieldValues.map((fieldValue) => {
              const fieldId = fieldValue.id;

              return (
                <div key={fieldId}>
                  {/* Object Type Selection */}
                  <div className="flex items-center gap-2">
                    <Popover open={openPopoverId === fieldId} onOpenChange={(open) => setOpenPopoverId(open ? fieldId : null)}>
                      <PopoverTrigger asChild>
                        <PrimaryButton
                          isPrimary={false}
                          className={`w-full flex !text-sm items-center justify-between border-input rounded-md ${
                            fieldValue.objectType
                              ? "!text-gray-900"
                              : "!text-muted-foreground"
                          }`}
                        >
                          {fieldValue.objectType ? (
                            <div className="flex items-center gap-1 truncate">
                              <span className="font-medium text-sm capitalize">
                                {fieldValue.objectType.toLowerCase()}
                              </span>
                              /
                              <span className="font-medium text-sm capitalize truncate whitespace-nowrap">
                                {fieldValue.field?.name}
                              </span>
                            </div>
                          ) : (
                            "Select field"
                          )}
                          <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                        </PrimaryButton>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[calc(30dvw-56px)]">
                        {!fieldValue.objectType && (
                          <div className="p-0 pb-2">
                            <div className="p-3 relative">
                              <Input
                                placeholder="Search"
                                className="pl-[36px] py-1.5"
                              />
                              <SearchIcon
                                className="w-4 h-4 text-gray-800 opacity-50 absolute left-6 top-1/2 -translate-y-1/2"
                                strokeWidth={3}
                              />
                            </div>
                            {ObjectTypeData?.map((object) => (
                              <div
                                key={object.type}
                                onClick={() => 
                                  updateFieldObjectType(fieldId, object.type)
                                }
                                className="flex items-center justify-between px-[14px] py-1.5 hover:bg-blue-50 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <object.icon className="w-4 h-4" />
                                  <span className="font-medium text-sm capitalize">
                                    {object.name}
                                  </span>
                                </div>
                                <ChevronRightIcon className="w-4 h-4 text-gray-800 opacity-50" />
                              </div>
                            ))}
                          </div>
                        )}

                        {fieldValue.objectType && (
                          <div className="p-0 pb-2">
                            <div className="flex items-center gap-1 p-3 pb-2">
                              <ChevronLeftIcon
                                className="!size-5 text-gray-800 opacity-50 cursor-pointer"
                                onClick={() =>
                                  updateFieldValue(fieldId, {
                                    objectType: null,
                                    field: null,
                                  })
                                }
                              />
                              <span className="font-medium text-sm capitalize">
                                {fieldValue.objectType.toLowerCase()}
                              </span>
                            </div>
                            <div className="px-3 mb-3 relative">
                              <Input
                                placeholder="Search"
                                className="pl-[36px] py-1.5"
                              />
                              <SearchIcon
                                className="!size-4 text-gray-500 opacity-50 absolute left-6 top-1/2 -translate-y-1/2"
                                strokeWidth={3}
                              />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                              {getFieldsForObjectType(
                                fieldValue.objectType!
                              ).map((field) => (
                                <div
                                  key={field.id}
                                  onClick={() => {
                                    updateFieldSelection(fieldId, field)
                                    setOpenPopoverId(null)
                                  }}
                                  className="flex items-center gap-2 px-[14px] py-1.5 hover:bg-blue-50 cursor-pointer"
                                >
                                  <FieldIconRenderer
                                    fieldIconType={
                                      field.slug.includes("phoneNumber")
                                        ? "PHONE"
                                        : field.inputType
                                    }
                                  />
                                  <span className="font-medium text-sm capitalize">
                                    {field.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => removeField(fieldId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Field Configuration */}
                  {fieldValue.field && (
                    <div className="flex items-start gap-1.5">
                      <svg
                        width="15"
                        height="22"
                        viewBox="0 0 15 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1.5 ml-3"
                      >
                        <path
                          d="M1 0V17C1 19.2091 2.79086 21 5 21H15"
                          stroke="#D1D5DB"
                        />
                      </svg>
                      <div className="mt-1.5 w-[calc(100%-30px)]">
                        {fieldValue.field.inputType === "TEXT" && (
                          <Input
                            type="text"
                            placeholder={fieldValue.field.name + "..."}
                            value={fieldValue.textValue || ""}
                            onChange={(e) =>
                              updateFieldValue(fieldId, {
                                textValue: e.target.value,
                              })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "NUMBER" && (
                          <Input
                            type="number"
                            placeholder={fieldValue.field.name + "..."}
                            value={fieldValue.numberValue || 0}
                            onChange={(e) =>
                              updateFieldValue(fieldId, {
                                numberValue: +e.target.value,
                              })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "RADIO_BUTTON" && (
                          <RadioFieldOptions
                            field={fieldValue.field}
                            selectedOption={fieldValue.radioOption || null}
                            setSelectedOption={(value) =>
                              updateFieldValue(fieldId, { radioOption: value })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "CHECK_BOX" && (
                          <MultipleSelectFieldOptions
                            field={fieldValue.field}
                            selectedOptions={fieldValue.checkboxOptions || []}
                            setSelectedOptions={(value) =>
                              updateFieldValue(fieldId, {
                                checkboxOptions: value,
                              })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "SINGLE_SELECT" && (
                          <SingleSelectFieldOptions
                            field={fieldValue.field}
                            selectedOption={
                              fieldValue.singleSelectOption || null
                            }
                            setSelectedOption={(value) =>
                              updateFieldValue(fieldId, {
                                singleSelectOption: value,
                              })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "MULTIPLE_SELECT" && (
                          <MultipleSelectFieldOptions
                            field={fieldValue.field}
                            selectedOptions={
                              fieldValue.multiSelectOptions || []
                            }
                            setSelectedOptions={(value) =>
                              updateFieldValue(fieldId, {
                                multiSelectOptions: value,
                              })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "DATE" && (
                          <DateFieldOptions
                            field={fieldValue.field}
                            date={fieldValue.date || null}
                            setDate={(value) =>
                              updateFieldValue(fieldId, { date: value })
                            }
                            time={fieldValue.time || null}
                            setTime={(value) =>
                              updateFieldValue(fieldId, { time: value })
                            }
                            open={fieldValue.dateOpen || false}
                            setOpen={(value) =>
                              updateFieldValue(fieldId, { dateOpen: value })
                            }
                          />
                        )}

                        {fieldValue.field.inputType === "USER" && (
                          <UserFieldOptions
                            field={fieldValue.field}
                            selectedOption={fieldValue.userOption || null}
                            setSelectedOption={(value) =>
                              updateFieldValue(fieldId, { userOption: value })
                            }
                            userSelectionType={fieldValue.userSelectionType}
                            setUserSelectionType={(value) =>
                              updateFieldValue(fieldId, {
                                userSelectionType: value,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <PrimaryButton
          isPrimary={false}
          className="flex items-center gap-1.5 w-fit border-none !px-0 !text-blue-600 !text-sm !font-medium"
          onClick={addNewFieldDropdown}
        >
          <PlusIcon className="w-4 h-4" />
          Add Field
        </PrimaryButton>
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

export default UpdateFieldsAction;
