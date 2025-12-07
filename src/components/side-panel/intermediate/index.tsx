/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useWorkflowSelectors } from "@/store/workflow.store";
import ActionsDetail from "../actions/detail";

type IntermediateProps = {
  closeSidePanel: () => void;
};

const Intermediate = ({ closeSidePanel }: IntermediateProps) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { selectedNode } = useWorkflowSelectors();
  const [nodeData, setNodeData] = useState<{ [key: string]: any; } | undefined>(undefined);

  useEffect(() => {
    if (selectedNode) {
      // Check if this is a router or if/else based on node config
      const nodeType = selectedNode.data?.config?.nodeType;
      const nodeName = selectedNode.data?.config?.nodeName || selectedNode.data?.label;
      
      // Check if it's a router or split by nodeType or nodeName
      if (nodeType === "flow_router" || nodeName === "Router") {
        setSelectedAction('flow_router');
      } else if (nodeType === "flow_split" || nodeName === "Split") {
        setSelectedAction('flow_split');
      } else {
        // Default to if/else
        setSelectedAction('flow_if_else');
      }
      
      setNodeData(selectedNode.data);
    }
  }, [selectedNode]);

  return (
    <>
      {selectedAction && <ActionsDetail goBack={closeSidePanel} selectedAction={selectedAction} nodeData={nodeData} />}
    </>
  );
};

export default Intermediate;
