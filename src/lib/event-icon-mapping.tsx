// Icon mapping utility for workflow nodes
import React from 'react';
import { 
  ContactCreatedIcon,
  ConversationIcon,
  FieldUpdatedIcon,
  PhoneIcon,
} from '@/components/assets/icons/triggers';
import { 
  SendMessageIcon, 
  ConditionIcon,
  WaitIcon,
  AddUpdateFieldsIcon,
} from '@/components/assets/icons/actions';
import {
  WhatsAppIcon,
  GmailIcon,
  LinqIcon,
  SendblueIcon,
  WhatsAppCloudIcon,
} from '@/components/assets/icons/channels';
import { Star, Filter, Split } from 'lucide-react';

export const iconMap = {
  // Triggers
  contact_created: ContactCreatedIcon,
  call_events: PhoneIcon,
  field_updated: FieldUpdatedIcon,
  conversation_state: ConversationIcon,

  // Actions
  send_message: SendMessageIcon,
  wait: WaitIcon,
  update_fields: AddUpdateFieldsIcon,
  flow_filter: Filter,
  flow_split: Split,
  
  // Conditionals
  conditional_branching: ConditionIcon,
  
  // Channel Icons
  whatsapp: WhatsAppIcon,
  gmail: GmailIcon,
  linq: LinqIcon,
  sendblue: SendblueIcon,
  whatsapp_cloud: WhatsAppCloudIcon,
  
  star: Star
} as const;

export type IconType = keyof typeof iconMap;

interface EventIconRendererProps {
  iconType: IconType | string;
  className?: string;
}

export const EventIconRenderer: React.FC<EventIconRendererProps> = ({ iconType, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[iconType as IconType];
  
  if (!IconComponent) {
    // Fallback to a default icon if not found
    const DefaultIcon = iconMap.star;
    return <DefaultIcon className={className} />;
  }
  
  return <IconComponent className={className} />;
};
