/* eslint-disable @typescript-eslint/no-explicit-any */

import SendMessageAction from "./all-actions/send-message";
import { ActionsEnum } from "@/utils/side-panel/actions/actions.enum";
import ConditionalBranchingAction from "./all-actions/conditional-branching";
import UpdateFieldsAction from "./all-actions/update-fields";

// Flow Actions
import IfElseAction from "./flow-actions/if-else";
import WaitAction from "./flow-actions/wait";
import RouterAction from "./flow-actions/router";
import FilterAction from "./flow-actions/filter";
import SplitAction from "./flow-actions/split";

// Integrations Actions
import InboundWebhookAction from "./flow-actions/inbound-webhook";

// CRM Actions
import AddCallOutcomeAction from "./crm-actions/add-call-outcome";
import AssignSetterOwnerAction from "./crm-actions/assign-setter-owner";
import CancelCallAction from "./crm-actions/cancel-call";
import CreateContactAction from "./crm-actions/create-contact";
import CreateContactNoteAction from "./crm-actions/create-contact-note";
import CreateTransactionAction from "./crm-actions/create-transaction";
import UpdateContactAction from "./crm-actions/update-contact";
import UpdateContactCustomFieldAction from "./crm-actions/update-contact-custom-field";
import UpdateContactStageAction from "./crm-actions/update-contact-stage";
import UpdateSetterOwnerAction from "./crm-actions/update-setter-owner";

// Search Actions
import SearchCallAction from "./search-actions/search-call";
import SearchContactAction from "./search-actions/search-contact";
import SearchCustomFieldsAction from "./search-actions/search-custom-fields";
import SearchTransactionsAction from "./search-actions/search-transactions";
import SearchUsersAction from "./search-actions/search-users";

// Communication Actions
import SendMessagesAction from "./communication-actions/send-messages";
import AssignChatAction from "./communication-actions/assign-chat";
import UnassignChatAction from "./communication-actions/unassign-chat";
import CloseConversationAction from "./communication-actions/close-conversation";
import OpenConversationAction from "./communication-actions/open-conversation";

type ActionsDetailProps = {
  selectedAction: string;
  nodeData: { [key: string]: any; } | undefined;
  goBack: () => void;
};

const ACTIONS_COMPONENTS = {
  [ActionsEnum.SEND_MESSAGE]: SendMessageAction,
  [ActionsEnum.CONDITIONAL_BRANCHING]: ConditionalBranchingAction,
  [ActionsEnum.UPDATE_FIELDS]: UpdateFieldsAction,
  // Flow Actions
  'flow_if_else': IfElseAction,
  'flow_if_else_branch': IfElseAction,
  'flow_wait': WaitAction,
  'flow_router': RouterAction,
  'flow_router_path': RouterAction,
  'flow_split': SplitAction,
  'flow_split_path': SplitAction,
  'flow_filter': FilterAction,
  'flow_inbound_webhook': InboundWebhookAction,
  // CRM Actions
  'crm_add_call_outcome': AddCallOutcomeAction,
  'crm_assign_setter_owner': AssignSetterOwnerAction,
  'crm_cancel_call': CancelCallAction,
  'crm_create_contact': CreateContactAction,
  'crm_create_contact_note': CreateContactNoteAction,
  'crm_create_transaction': CreateTransactionAction,
  'crm_update_contact': UpdateContactAction,
  'crm_update_contact_custom_field': UpdateContactCustomFieldAction,
  'crm_update_contact_stage': UpdateContactStageAction,
  'crm_update_setter_owner': UpdateSetterOwnerAction,
  // Search Actions
  'search_call': SearchCallAction,
  'search_contact': SearchContactAction,
  'search_custom_fields': SearchCustomFieldsAction,
  'search_transactions': SearchTransactionsAction,
  'search_users': SearchUsersAction,

  // Communication Actions
  'comm_send_messages': SendMessagesAction,
  'comm_assign_chat': AssignChatAction,
  'comm_unassign_chat': UnassignChatAction,
  'comm_close_conversation': CloseConversationAction,
  'comm_open_conversation': OpenConversationAction,
} as const;

const ActionsDetail = ({ nodeData, selectedAction, goBack }: ActionsDetailProps) => {  
  const ActionsComponent = ACTIONS_COMPONENTS[selectedAction as keyof typeof ACTIONS_COMPONENTS];
  
  if (!ActionsComponent) {
    return <div>Unknown action selected</div>;
  }

  // Pass selectedAction to all components (some like IfElse require it)
  return (
    <ActionsComponent 
      nodeData={nodeData} 
      goBack={goBack} 
      selectedAction={selectedAction}
    />
  );
};

export default ActionsDetail;
