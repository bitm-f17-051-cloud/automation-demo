/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import ActionsList from "./list";
import ActionsDetail from "./detail";
import { useWorkflowSelectors } from "@/store/workflow.store";

type ActionProps = {
  closeSidePanel: () => void;
};

const Actions = ({ closeSidePanel }: ActionProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { selectedNode } = useWorkflowSelectors();
  const [nodeData, setNodeData] = useState<{ [key: string]: any; } | undefined>(undefined);

  useEffect(() => {
    if (selectedNode) {
      const actionType = selectedNode.data.config?.nodeType || null;
      console.log("Selected node action type:", actionType, "Node data:", selectedNode.data);
      setSelectedAction(actionType);
      setNodeData(selectedNode.data.config);
    }
  }, [selectedNode]);

  return (
    <div className="flex flex-col h-full">
      {!selectedAction && <ActionsList closeSidePanel={closeSidePanel} setSelectedAction={setSelectedAction} />}
      {selectedAction && <ActionsDetail goBack={() => setSelectedAction(null)} selectedAction={selectedAction} nodeData={nodeData} />}
    </div>
  );
};

export default Actions;
