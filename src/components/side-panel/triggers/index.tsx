/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import TriggersList from "./list";
import TriggersDetail from "./detail";
import { useWorkflowSelectors } from "@/store/workflow.store";

type TriggersProps = {
  closeSidePanel: () => void;
};

const Triggers = ({ closeSidePanel }: TriggersProps) => {
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const { selectedNode } = useWorkflowSelectors();
  const [nodeData, setNodeData] = useState<{ [key: string]: any; } | undefined>(undefined);

  useEffect(() => {
    if (selectedNode) {
      setSelectedTrigger(selectedNode.data.config?.nodeType || null);
      setNodeData(selectedNode.data.config);
    }
  }, [selectedNode]);
  
  return (
    <div className="flex flex-col h-full">
      {!selectedTrigger && <TriggersList closeSidePanel={closeSidePanel} setSelectedTrigger={setSelectedTrigger} />}
      {selectedTrigger && (
        <TriggersDetail
          goBack={() => setSelectedTrigger(null)}
          selectedTrigger={selectedTrigger}
          nodeData={nodeData}
          setSelectedTrigger={setSelectedTrigger}
        />
      )}
    </div>
  );
};

export default Triggers;
