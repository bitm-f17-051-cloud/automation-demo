export enum TriggersEnum {
  CONTACT_CREATED = "contact_created",
  CALL_EVENTS = "call_events",
  // Inbound
  INBOUND_CUSTOM_CONTACT_FIELD_UPDATED = "inbound_custom_contact_field_updated",
  INBOUND_NEW_CONTACTS = "inbound_watch_new_contacts",
  INBOUND_WATCH_CONTACT_UPDATE = "inbound_watch_contact_update",
  INBOUND_WATCH_TRANSACTION_SYNCED = "inbound_watch_transaction_synced",
  INBOUND_WATCH_NOTE = "inbound_watch_note",
  // Scheduler
  SCHEDULER_WATCH_APPOINTMENT_SETTING_OUTCOME = "scheduler_watch_appointment_setting_outcome",
  SCHEDULER_WATCH_CALL_BOOKED = "scheduler_watch_call_booked",
  SCHEDULER_WATCH_CALL_OUTCOME = "scheduler_watch_call_outcome",
  SCHEDULER_WATCH_CANCELLED_CALL = "scheduler_watch_cancelled_call",
  SCHEDULER_WATCH_RESCHEDULED_CALL = "scheduler_watch_rescheduled_call",
  SCHEDULER_WATCH_SETTER_OWNER_ASSIGNED = "scheduler_watch_setter_owner_assigned",
  // Integration
  WEBHOOK_TRIGGER = "webhook_trigger",
}

export enum FIELD_UPDATED_CONDITIONS {
  IS = "Is",
  IS_NOT = "Is Not",
  EXISTS = "Exists",
  DOES_NOT_EXIST = "Doesn't Exist",
  CHANGE_TO = "Change To",
}