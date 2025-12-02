import React from "react";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useWorkflowStore } from "@/store/workflow.store";
import { WorkflowNode } from "@/lib/worker-types";

export const AddTriggerNode: React.FC<NodeProps> = () => {
  const { nodes, addNode, selectNode } = useWorkflowStore();

  const handleAddTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const currentStartNodes = nodes.filter((n) => n.type === "start");
    const baseY = 80;
    const horizontalSpacing = 30;
    const triggerWidth = 312; // Match actual trigger node width
    
    let newX = 120;
    if (currentStartNodes.length > 0) {
      const rightMost = currentStartNodes.reduce(
        (max, n) => Math.max(max, (n.position?.x || 0) + ((n.measured?.width as number) || triggerWidth)),
        0
      );
      newX = rightMost + horizontalSpacing;
    }
    
    const triggerId = uuidv4();
    const newTrigger: WorkflowNode = {
      id: triggerId,
      type: "start",
      position: { x: newX, y: baseY },
      measured: { 
        width: triggerWidth, 
        height: 48 
      },
      data: {
        label: "Trigger",
        labelIcon: "trigger",
      },
    };
    
    addNode(newTrigger);
    selectNode(triggerId);
  };

  return (
    <div className="nopan nodrag">
      <button
        onClick={handleAddTrigger}
        className="group w-[312px] h-[48px] bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg flex items-center gap-2 px-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/50"
      >
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <PlusIcon className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-blue-600">
          Add New Trigger
        </span>
      </button>
    </div>
  );
};

