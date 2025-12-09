import { 
  ContactCreatedIcon, 
  FieldUpdatedIcon, 
  PhoneIcon,
  WebhookIcon
} from '@/components/assets/icons/triggers';

// New categories for Contact and Scheduler (basic coverage to match requested UI)
export const CONTACT_TRIGGERS = {
  WATCH_NEW_CONTACTS: {
    value: 'inbound_watch_new_contacts',
    label: 'Contact Created',
    icon: ContactCreatedIcon,
    category: 'Contact',
    description: 'Triggers when a new contact is created in iClosed.'
  },
  WATCH_CONTACT_UPDATE: {
    value: 'inbound_watch_contact_update',
    label: 'Contact Update',
    icon: FieldUpdatedIcon,
    category: 'Contact',
    description: 'Triggers when a contact is updated.'
  },
  CUSTOM_CONTACT_FIELD_UPDATED: {
    value: 'inbound_custom_contact_field_updated',
    label: 'Field Updated',
    icon: FieldUpdatedIcon,
    category: 'Contact',
    description: 'Triggers when a contact custom field is updated.'
  },
  WATCH_TRANSACTION_SYNCED: {
    value: 'inbound_watch_transaction_synced',
    label: 'Transaction Synced',
    icon: FieldUpdatedIcon,
    category: 'Contact',
    description: 'Triggers when a transaction is synced with a Deal.'
  },
  WATCH_NOTE: {
    value: 'inbound_watch_note',
    label: 'Note Added',
    icon: FieldUpdatedIcon,
    category: 'Contact',
    description: 'Triggers when a note is added.'
  }
} as const;

export const SCHEDULER_TRIGGERS = {
  WATCH_APPOINTMENT_SETTING_OUTCOME: {
    value: 'scheduler_watch_appointment_setting_outcome',
    label: 'Appointment Setting Outcome',
    icon: PhoneIcon,
    category: 'Scheduler',
    description: 'Triggers when appointment setting outcome is added.'
  },
  WATCH_CALL_BOOKED: {
    value: 'scheduler_watch_call_booked',
    label: 'Call Booked',
    icon: PhoneIcon,
    category: 'Scheduler',
    description: 'Triggers when a new call is scheduled.'
  },
  WATCH_CALL_OUTCOME: {
    value: 'scheduler_watch_call_outcome',
    label: 'Call Outcome',
    icon: PhoneIcon,
    category: 'Scheduler',
    description: 'Triggers whenever a call outcome is added.'
  },
  WATCH_CANCELLED_CALL: {
    value: 'scheduler_watch_cancelled_call',
    label: 'Cancelled Call',
    icon: PhoneIcon,
    category: 'Scheduler',
    description: 'Triggers when a call is cancelled.'
  },
  WATCH_RESCHEDULED_CALL: {
    value: 'scheduler_watch_rescheduled_call',
    label: 'Rescheduled Call',
    icon: PhoneIcon,
    category: 'Scheduler',
    description: 'Triggers when an upcoming call is rescheduled.'
  },
  WATCH_SETTER_OWNER_ASSIGNED: {
    value: 'scheduler_watch_setter_owner_assigned',
    label: 'Setter Owner Assigned',
    icon: ContactCreatedIcon,
    category: 'Scheduler',
    description: 'Triggers when a setter owner is assigned to a contact.'
  },
  WATCH_CONTACT_BY_STATUS: {
    value: 'scheduler_watch_contact_by_status',
    label: 'Contact by Status',
    icon: FieldUpdatedIcon,
    category: 'Scheduler',
    description: 'Triggers when a contact status changes.'
  }
} as const;

export const INTEGRATION_TRIGGERS = {
  WEBHOOK_TRIGGER: {
    value: 'webhook_trigger',
    label: 'Inbound Webhook',
    icon: WebhookIcon,
    category: 'Integration',
    description: 'Triggered by webhook events'
  }
} as const;

export const SCHEDULING_STATUS = {
  POTENTIAL: {
    value: 'POTENTIAL',
    label: 'Potential',
    color: '#2dd4bf',
  },
  STRATEGY_CALL_BOOKED: {
    value: 'STRATEGY_CALL_BOOKED',
    label: 'Strategy Call Booked',
    color: '#2563eb',
  },
  DISQUALIFIED: {
    value: 'DISQUALIFIED',
    label: 'Disqualified',
    color: '#dc2626',
  },
  QUALIFIED: {
    value: 'QUALIFIED',
    label: 'Qualified',
    color: '#0d9488',
  },
  DISCOVERY_CALL_BOOKED: {
    value: 'DISCOVERY_CALL_BOOKED',
    label: 'Discovery Call Booked',
    color: '#9333ea',
  }
} as const;

export const getAllTriggers = () => {
  return [
    ...Object.values(CONTACT_TRIGGERS),
    ...Object.values(SCHEDULER_TRIGGERS),
    ...Object.values(INTEGRATION_TRIGGERS)
  ];
};

export const getTriggersByCategory = (category: string) => {
  return getAllTriggers().filter(trigger => trigger.category === category);
};

export const getTriggerByValue = (value: string) => {
  return getAllTriggers().find(trigger => trigger.value === value);
};

export const getTriggersGroupedByCategory = () => {
  const allTriggers = getAllTriggers();
  
  return allTriggers.reduce((grouped, trigger) => {
    const category = trigger.category;
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(trigger);
    
    return grouped;
  }, {} as Record<string, typeof allTriggers>);
};
