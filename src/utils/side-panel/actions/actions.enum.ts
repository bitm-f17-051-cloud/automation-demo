export enum ActionsEnum {
  SEND_MESSAGE = "send_message",
  CONDITIONAL_BRANCHING = "conditional_branching",
  UPDATE_FIELDS = "update_fields",
}

export enum WAIT_EVENT_BASED_CONDITIONS {
  AFTER_NEW_CALL_BOOKED = "After a new call is booked",
  BEFORE_NEW_CALL_BOOKED = "Before a new call is booked",
  NO_CALL_BOOKED_IN_TIMEFRAME = "No call booked in timeframe",
  BEFORE_CALL_STARTS = "Before a call starts",
  AFTER_CALL_STARTS = "After call starts",
  AFTER_CALL_ENDS = "After call ends",
  AFTER_CALL_CANCELLED = "After call cancelled"
}

export enum OBJECT_TYPES {
  CONTACT = "CONTACT",
  CALL = "CALL",
  EVENT = "EVENT",
  DEAL = "DEAL",
  USER = "USER",
}