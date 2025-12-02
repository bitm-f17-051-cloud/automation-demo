"use client";

import { useWorkflowStore } from "@/store/workflow.store";
import Triggers from "./triggers";
import Actions from "./actions";
import Intermediate from "./intermediate";
import Branch from "./branch";

const SidePanel = () => {
  const { selectedNodeId, selectedNodeType, selectNode } = useWorkflowStore();

  const closeSidePanel = () => {
    selectNode(null);
  };

  return (
    <div
      className={`w-[30vw] h-full bg-white border-l border-gray-200 flex flex-col ${
        selectedNodeId ? "block" : "hidden"
      }`}
    >
      {selectedNodeType === "start" && <Triggers closeSidePanel={closeSidePanel} />}
      {selectedNodeType === "action" && <Actions closeSidePanel={closeSidePanel} />}
      {selectedNodeType === "intermediate" && <Intermediate closeSidePanel={closeSidePanel} />}
      {selectedNodeType === "condition" && <Branch closeSidePanel={closeSidePanel} />}
    </div>
  );
};

export default SidePanel;
