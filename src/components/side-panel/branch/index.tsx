/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useWorkflowSelectors } from "@/store/workflow.store";
import ActionsDetail from "../actions/detail";

type BranchProps = {
  closeSidePanel: () => void;
};

const Branch = ({ closeSidePanel }: BranchProps) => {
  const { selectedNode } = useWorkflowSelectors();
  const [nodeData, setNodeData] = useState<{ [key: string]: any; } | undefined>(undefined);
  const [selectedAction, setSelectedAction] = useState<string>("flow_if_else_branch");

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data.config);
      // Check if this is a router path node or if/else branch
      const nodeType = selectedNode.data.config?.nodeType;
      if (nodeType === "flow_router_path") {
        setSelectedAction("flow_router_path");
      } else {
        setSelectedAction("flow_if_else_branch");
      }
    }
  }, [selectedNode]);

  return (
    <>
      <ActionsDetail goBack={closeSidePanel} selectedAction={selectedAction} nodeData={nodeData} />
    </>
  );
};

export default Branch;
