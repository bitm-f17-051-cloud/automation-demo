import { DateIcon, DefaultIcon, PhoneIcon, RadioIcon } from "@/components/assets/icons/objects/types";
import { UserIcon } from "@/components/assets/icons/objects";
import { ListTodo, CheckSquare2, ListChecks } from "lucide-react";

export const fieldIconMap = {
  DATE: DateIcon,
  PHONE: PhoneIcon,
  USER: UserIcon,
  RADIO_BUTTON: RadioIcon,
  SINGLE_SELECT: ListTodo,
  MULTIPLE_SELECT: ListChecks,
  CHECK_BOX: CheckSquare2
} as const;

export type FieldIconType = keyof typeof fieldIconMap;

interface FieldIconRendererProps {
  fieldIconType: FieldIconType | string;
  className?: string;
}

export const FieldIconRenderer: React.FC<FieldIconRendererProps> = ({ fieldIconType, className = "!size-4 text-gray-600" }) => {
  const IconComponent = fieldIconMap[fieldIconType as FieldIconType];
  
  if (!IconComponent) {
    // Fallback to a default icon if not found
    return <DefaultIcon className={className} />;
  }
  
  return <IconComponent className={className} />;
};