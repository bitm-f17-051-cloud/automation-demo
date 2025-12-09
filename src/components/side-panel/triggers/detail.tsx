/* eslint-disable @typescript-eslint/no-explicit-any */

import { TriggersEnum } from "@/utils/side-panel/triggers/triggers.enum";
import NewContactsTrigger from "./all-triggers/new-contacts";
import ContactUpdatedTrigger from "./all-triggers/contact-updated";
import ContactCustomFieldTrigger from "./all-triggers/contact-custom-field";
import AppointmentSettingTrigger from "./all-triggers/appointment-setting";
import SimpleTrigger from "./all-triggers/simple-trigger";
import GenericInboundSchedulerTrigger from "./all-triggers/generic-inbound-scheduler";
import SharedTriggerFilter from "./all-triggers/shared-trigger-filter";
import WebhookTrigger from "./all-triggers/webhook-trigger";
import { getAllTriggers, getTriggerByValue } from "@/utils/side-panel/triggers/triggers.constants";
import TriggerSelector from "./components/trigger-selector";

type TriggersDetailProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedTrigger: string;
  setSelectedTrigger: (trigger: string | null) => void;
};

// Use custom components for triggers that have their own implementation
const CUSTOM_TRIGGERS: Record<string, any> = {
  [TriggersEnum.INBOUND_NEW_CONTACTS]: NewContactsTrigger,
  [TriggersEnum.INBOUND_WATCH_CONTACT_UPDATE]: ContactUpdatedTrigger,
  [TriggersEnum.INBOUND_CUSTOM_CONTACT_FIELD_UPDATED]: ContactCustomFieldTrigger,
  [TriggersEnum.SCHEDULER_WATCH_APPOINTMENT_SETTING_OUTCOME]: AppointmentSettingTrigger,
  [TriggersEnum.SCHEDULER_WATCH_CALL_OUTCOME]: GenericInboundSchedulerTrigger,
  [TriggersEnum.SCHEDULER_WATCH_CONTACT_BY_STATUS]: GenericInboundSchedulerTrigger,
  [TriggersEnum.INBOUND_WATCH_NOTE]: SimpleTrigger,
  [TriggersEnum.INBOUND_WATCH_TRANSACTION_SYNCED]: SimpleTrigger,
  [TriggersEnum.SCHEDULER_WATCH_SETTER_OWNER_ASSIGNED]: SimpleTrigger,
  [TriggersEnum.WEBHOOK_TRIGGER]: WebhookTrigger,
};

const TriggersDetail = ({ goBack, selectedTrigger, nodeData, setSelectedTrigger }: TriggersDetailProps) => {  
  // Check if this trigger has a custom component
  const CustomComponent = CUSTOM_TRIGGERS[selectedTrigger as keyof typeof CUSTOM_TRIGGERS];
  const allTriggers = getAllTriggers();

  const handleTriggerChange = (value: string) => {
    if (value === selectedTrigger) return;
    setSelectedTrigger(value);
  };

  const header = (
    <TriggerSelector
      selectedTrigger={selectedTrigger}
      triggers={allTriggers}
      onChange={handleTriggerChange}
    />
  );

  if (CustomComponent) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {header}
        <div className="flex-1 min-h-0">
          <CustomComponent goBack={goBack} nodeData={nodeData} selectedTrigger={selectedTrigger} />
        </div>
      </div>
    );
  }

  // Otherwise use the shared filter component
  const triggerMeta = getTriggerByValue(selectedTrigger);
  
  if (!triggerMeta) {
    return <div className="flex items-center justify-center h-full p-6 text-gray-500">Unknown trigger selected</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {header}
      <div className="flex-1 min-h-0">
        <SharedTriggerFilter 
          goBack={goBack} 
          nodeData={nodeData} 
          triggerValue={triggerMeta.value}
          triggerLabel={triggerMeta.label}
          triggerIcon={triggerMeta.icon}
          triggerDescription={triggerMeta.description}
        />
      </div>
    </div>
  );
};

export default TriggersDetail;
