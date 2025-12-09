import React, { useCallback, useEffect, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Play, PlusIcon, Edit2, Trash2, Copy, MoreVertical, CheckCircle, AlertCircle, Zap, Power } from "lucide-react";
import { BaseNode } from "./BaseNode";
import { WorkflowNode } from "@/lib/worker-types";
import { Separator } from "../ui/separator";
import { NodeIconRenderer } from "@/lib/node-icon-mapping";
import { EventIconRenderer } from "@/lib/event-icon-mapping";
import Collapsable from "../ui/collapsible";
import { useWorkflowWorker } from "@/hooks/useWorkflowWorker";
import { useWorkflowStore } from "@/store/workflow.store";
import { ContactCreatedEventProperties } from "../side-panel/triggers/all-triggers/contact-created";
import { TriggersEnum } from "@/utils/side-panel/triggers/triggers.enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export const StartNode: React.FC<NodeProps> = (props) => {
  const data: WorkflowNode["data"] = props.data as WorkflowNode["data"];
  const { labelIcon, config } = data;
  const [expanded, setExpanded] = useState(0);
  const { isReady, computeLayout } = useWorkflowWorker();
  const { nodes, edges, setNodes, setEdges, setLayouting } = useWorkflowStore();
  const [nodeIndex, setNodeIndex] = useState(0);

  useEffect(() => {
    setNodeIndex(nodes.findIndex((node) => node.id === props.id));
  }, [nodes, props.id]);

  const autoLayout = useCallback(async () => {
    if (!isReady || nodes.length === 0) return;
    
    setLayouting(true);
    try {
      const layoutResult = await computeLayout(nodes, edges);
      setNodes(layoutResult.nodes);
      setEdges(layoutResult.edges);
    } catch (error) {
      console.error('Layout computation failed:', error);
    } finally {
      setLayouting(false);
    }
  }, [nodes, edges, isReady, computeLayout, setNodes, setEdges, setLayouting]);

  const { selectNode, deleteNode, addNode, updateNode } = useWorkflowStore();
  
  const handleAddAction = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Find the edge that starts from this node
    const outgoingEdge = edges.find((edge) => edge.source === props.id);
    if (outgoingEdge) {
      // Select the target node (the empty action node)
      selectNode(outgoingEdge.target);
    }
  }, [edges, props.id, selectNode]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(props.id);
  }, [props.id, selectNode]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trigger?')) {
      deleteNode(props.id);
    }
  }, [props.id, deleteNode]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Create a duplicate of this node
    const currentNode = nodes.find(n => n.id === props.id);
    if (!currentNode) return;
    
    const newNode: WorkflowNode = {
      ...currentNode,
      id: `${props.id}-copy-${Date.now()}`,
      position: {
        x: currentNode.position.x + 50,
        y: currentNode.position.y + 50,
      },
    };
    addNode(newNode);
  }, [props.id, nodes, addNode]);

  // Check if node is properly configured
  const isConfigured = !!config;
  const hasError = false; // You can add validation logic here
  
  // Count filters/properties for badge
  const filterCount = config?.properties?.length || 0;
  const hasFilters = filterCount > 0;

  return (
    <BaseNode
      {...props}
      title="Start"
      icon={<Play className="w-4 h-4" />}
      showHandles={{ top: false, right: false, bottom: true, left: false }}
      className="!w-[312px] p-0 overflow-hidden"
    >
      {/* Header Bar */}
      {config && (
        <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 flex items-center justify-end">
          <div className="flex items-center gap-1.5">
            <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <Play className="w-3 h-3 text-gray-600" />
            </button>
            <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
              <Power className="w-3 h-3 text-gray-600" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
                  <MoreVertical className="w-3 h-3 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit} className="gap-2 cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="gap-2 cursor-pointer">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="gap-2 cursor-pointer text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="px-3 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {config ? (
              <EventIconRenderer iconType={config.nodeType} className="w-6 h-6 text-blue-600" />
            ) : labelIcon && (
              <Play className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div className="flex flex-col gap-0 flex-1 min-w-0">
            {config ? (
              <>
                <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight">
                  {config.nodeSubtitle || config.nodeName}
                </h3>
                {filterCount > 0 && (
                  <p className="text-xs text-gray-500 leading-tight">
                    {filterCount} {filterCount === 1 ? 'filter' : 'filters'} selected
                  </p>
                )}
              </>
            ) : (
              <span className="font-medium text-sm text-gray-600">Trigger</span>
            )}
          </div>
        </div>
        {config && (
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1.5 flex-shrink-0 transition-colors">
            <Zap className="w-3.5 h-3.5 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">Trigger</span>
          </button>
        )}
      </div>
      
      {/* Add Action Button */}
      {config && (
        <button
          onClick={handleAddAction}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10 border-4 border-white"
        >
          <PlusIcon className="w-5 h-5 text-white font-bold" />
        </button>
      )}
    </BaseNode>
  );
};
