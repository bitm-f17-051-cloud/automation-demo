import { 
  AddUpdateFieldsIcon,
  CallIcon,
  AddNoteIcon,
  DealIcon,
  WebhookIcon
} from '@/components/assets/icons/actions';
import { 
  GitBranch, 
  Clock, 
  Split,
  Filter,
  Share2
} from 'lucide-react';

// Call-related actions
export const CALL_ACTIONS = {
  ADD_CALL_OUTCOME: {
    value: 'crm_add_call_outcome',
    label: 'Add Call Outcome',
    icon: CallIcon,
    category: 'CALL',
    description: 'Action to add Call Outcome in iClosed.'
  },
  CANCEL_CALL: {
    value: 'crm_cancel_call',
    label: 'Cancel Call',
    icon: CallIcon,
    category: 'CALL',
    description: 'Action to cancel a call in iClosed.'
  }
} as const;

// Contact-related actions
export const CONTACT_ACTIONS = {
  ASSIGN_SETTER_OWNER: {
    value: 'crm_assign_setter_owner',
    label: 'Assign Setter Owner',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Action to assign a Setter Owner to a Contact.'
  },
  CREATE_CONTACT: {
    value: 'crm_create_contact',
    label: 'Create a New Contact',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Creates a new contact in iClosed.'
  },
  CREATE_CONTACT_NOTE: {
    value: 'crm_create_contact_note',
    label: 'Create a New Contact Note',
    icon: AddNoteIcon,
    category: 'CONTACT',
    description: 'Creates a new contact note in iClosed.'
  },
  CREATE_TRANSACTION: {
    value: 'crm_create_transaction',
    label: 'Create a New Transaction',
    icon: DealIcon,
    category: 'CONTACT',
    description: 'Creates a new transaction in iClosed.'
  },
  UPDATE_CONTACT: {
    value: 'crm_update_contact',
    label: 'Update Contact',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Action to update a contact in iClosed.'
  },
  UPDATE_CONTACT_CUSTOM_FIELD: {
    value: 'crm_update_contact_custom_field',
    label: 'Update Contact Custom Field',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Action to update a contact custom field in iClosed.'
  },
  UPDATE_SETTER_OWNER: {
    value: 'crm_update_setter_owner',
    label: 'Update Setter Owner',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Updates the setter owner of contact in iClosed.'
  },
  UPDATE_CONTACT_STAGE: {
    value: 'crm_update_contact_stage',
    label: 'Update Contact Stage',
    icon: AddUpdateFieldsIcon,
    category: 'CONTACT',
    description: 'Action to update the contact stage in iClosed.'
  }
} as const;

// Searches section
export const SEARCH_ACTIONS = {
  SEARCH_CALL: {
    value: 'search_call',
    label: 'Search Call',
    icon: CallIcon,
    category: 'SEARCHES',
    description: 'Search Call in iClosed by contactId, date, type and closer owner.'
  },
  SEARCH_CONTACT: {
    value: 'search_contact',
    label: 'Search Contact',
    icon: AddUpdateFieldsIcon,
    category: 'SEARCHES',
    description: 'Searches for contact by email or phone number.'
  },
  SEARCH_CUSTOM_FIELDS: {
    value: 'search_custom_fields',
    label: 'Search Custom Fields',
    icon: AddUpdateFieldsIcon,
    category: 'SEARCHES',
    description: 'Search Custom fields by name and type.'
  },
  SEARCH_TRANSACTIONS: {
    value: 'search_transactions',
    label: 'Search Transactions',
    icon: DealIcon,
    category: 'SEARCHES',
    description: 'Search transaction by email or Phone Number.'
  },
  SEARCH_USERS: {
    value: 'search_users',
    label: 'Search Users',
    icon: AddUpdateFieldsIcon,
    category: 'SEARCHES',
    description: 'Searches for users by email or phone number.'
  }
} as const;

export const COMMUNICATION_ACTIONS = {
  SEND_MESSAGES: {
    value: 'comm_send_messages',
    label: 'Send Messages',
    icon: AddNoteIcon,
    category: 'COMMUNICATION',
    description: 'Send a message to a contact'
  },
  ASSIGN_CHAT: {
    value: 'comm_assign_chat',
    label: 'Assign a chat',
    icon: AddUpdateFieldsIcon,
    category: 'COMMUNICATION',
    description: 'Assign a chat conversation to a team member'
  },
  CLOSE_CONVERSATION: {
    value: 'comm_close_conversation',
    label: 'Close conversation',
    icon: AddNoteIcon,
    category: 'COMMUNICATION',
    description: 'Close an active conversation',
    tag: 'Need Discussion'
  },
  OPEN_CONVERSATION: {
    value: 'comm_open_conversation',
    label: 'Open conversation',
    icon: AddNoteIcon,
    category: 'COMMUNICATION',
    description: 'Open or reopen a conversation',
    tag: 'Need Discussion'
  }
} as const;

export const FLOW_ACTIONS = {
  IF_ELSE: {
    value: 'flow_if_else',
    label: 'If / Else',
    icon: GitBranch,
    category: 'DECISION',
    description: 'Create conditional if/else logic'
  },
  WAIT: {
    value: 'flow_wait',
    label: 'Wait',
    icon: Clock,
    category: 'DECISION',
    description: 'Pause workflow execution'
  },
  ROUTER: {
    value: 'flow_router',
    label: 'Router',
    icon: Share2,
    category: 'DECISION',
    description: 'Route to different workflow paths'
  },
  FILTER: {
    value: 'flow_filter',
    label: 'Filter',
    icon: Filter,
    category: 'DECISION',
    description: 'Filter workflow data'
  },
  SPLIT: {
    value: 'flow_split',
    label: 'Split',
    icon: Split,
    category: 'DECISION',
    description: 'Distribute workflow across multiple paths'
  }
} as const;

export const INTEGRATIONS_ACTIONS = {
  OUTBOUND_WEBHOOK: {
    value: 'flow_inbound_webhook',
    label: 'Outbound Webhook',
    icon: WebhookIcon,
    category: 'INTEGRATIONS',
    description: 'Send data to external webhook'
  }
} as const;

export const WAIT_CONDITIONS = {
  PERIOD_OF_TIME: {
    label: 'A set period of time',
    description: 'Wait for a specific time period'
  },
  SPECIFIC_DATE_TIME: {
    label: 'Until a specific date and time',
    description: 'Until a specific date and time'
  },
  EVENT_BASED: {
    label: 'Event based',
    description: 'Wait until before or after a call is booked for an event'
  },
  COMMUNICATIONS_BASED: {
    label: 'Communications based',
    description: 'Wait until a contact’s interaction meets certain conditions'
  },
  CUSTOM_FIELD_MATCH: {
    label: 'Until a custom date field matches',
    description: 'e.g. Until 5 days before the webinar_date'
  }
} as const;

export const getAllActions = () => {
  return [
    ...Object.values(FLOW_ACTIONS),
    ...Object.values(CALL_ACTIONS),
    ...Object.values(CONTACT_ACTIONS),
    ...Object.values(SEARCH_ACTIONS),
    ...Object.values(COMMUNICATION_ACTIONS),
    ...Object.values(INTEGRATIONS_ACTIONS)
  ];
};

export const getActionByValue = (value: string) => {
  return getAllActions().find(action => action.value === value);
};

export const getActionsGroupedByCategory = () => {
  const allActions = getAllActions();
  
  return allActions.reduce((grouped, action) => {
    const category = action.category;
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(action);
    
    return grouped;
  }, {} as Record<string, typeof allActions>);
};
