import React from "react";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useWorkflowStore } from "@/store/workflow.store";
import { WorkflowNode } from "@/lib/worker-types";
import { BaseNode } from "./BaseNode";

export const AddTriggerNode: React.FC<NodeProps> = (props) => {
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
      <BaseNode
        id={props.id}
        selected={props.selected}
        title="Add Trigger"
        showHandles={{ top: false, right: false, bottom: true, left: false }}
        className="!w-[312px] !h-[48px] p-0 border-2 border-dashed border-blue-400 hover:border-blue-500 bg-white"
      >
        <button
          onClick={handleAddTrigger}
          className="w-full h-full px-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 rounded-lg"
        >
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
            <PlusIcon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-blue-600">
            Add New Trigger
          </span>
        </button>
      </BaseNode>
    </div>
  );
};

