// Action node component
import React, { useCallback, useEffect, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { EllipsisVertical, PlusIcon, Edit2, Trash2, Copy, MoreVertical, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { WorkflowNode } from '@/lib/worker-types';
import Collapsable from '../ui/collapsible';
import { Separator } from '../ui/separator';
import { EventIconRenderer } from '@/lib/event-icon-mapping';
import { useWorkflowStore } from '@/store/workflow.store';
import { useWorkflowWorker } from '@/hooks/useWorkflowWorker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

export const ActionNode: React.FC<NodeProps> = (props) => {
  const data: WorkflowNode["data"] = props.data as WorkflowNode["data"];
  const { label, config } = data;
  const [expanded, setExpanded] = useState(0);
  const { isReady, computeLayout } = useWorkflowWorker();
  const { nodes, edges, setNodes, setEdges, setLayouting } = useWorkflowStore();
  const [nodeIndex, setNodeIndex] = useState(0);

  useEffect(() => {
    setNodeIndex(nodes.findIndex((node) => node.id === props.id));
  }, [nodes, props.id]);

  const [didLayout, setDidLayout] = useState(false);
  const { selectNode, deleteNode, addNode } = useWorkflowStore();

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
    if (confirm('Are you sure you want to delete this action?')) {
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
  
  // Count properties for badge (excluding wait nodes - they don't show property counts)
  const isWaitNode = config?.nodeType === 'wait';
  const propertyCount = config?.properties?.length || 0;
  const hasProperties = !isWaitNode && propertyCount > 0;

  const autoLayout = useCallback(async () => {
    if (!isReady || nodes.length === 0) return;
    
    setLayouting(true);
    try {
      const layoutResult = await computeLayout(nodes, edges);
      setNodes(layoutResult.nodes);
      setEdges(layoutResult.edges);
      setDidLayout(true);
    } catch (error) {
      console.error('Layout computation failed:', error);
    } finally {
      setLayouting(false);
    }
  }, [nodes, edges, isReady, computeLayout, setNodes, setEdges, setLayouting]);

  useEffect(() => {
    if (didLayout) return;

    const timeout = setTimeout(() => {
      autoLayout();
    }, 10);

    return () => {
      clearTimeout(timeout);
    }
  }, [config, autoLayout, didLayout])

  return (
    <BaseNode
      {...props}
      title="Action"
      showHandles={{ top: true, right: false, bottom: true, left: false }}
      className={`!w-[312px] !h-[48px] p-0 flex items-center justify-center`}
    >
      {/* Node Actions Menu - Top Right */}
      {config && (
        <div className="absolute -top-2 -right-2 z-20 flex items-center gap-1">
          {/* Configuration Status Indicator */}
          {isConfigured && !hasError && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white" title="Configured">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
          {hasError && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white" title="Has errors">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
          
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-6 h-6 bg-white hover:bg-gray-50 border border-gray-300 rounded-full flex items-center justify-center shadow-md transition-colors">
                <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
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
      )}

      <div className="px-3 h-full flex items-center justify-between gap-3 w-full">
        {config && (
          <>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <EventIconRenderer iconType={config.nodeIcon || config.nodeType} className="w-5 h-5" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {config.nodeName}
                </h3>
                <p className="text-[10px] text-gray-400 leading-tight font-mono">
                  {config.nodeType}
                </p>
              </div>
            </div>
          </>
        )}
        {!config && (
          <div className="w-full flex items-center justify-center">
            <h3 className="font-medium text-sm text-gray-500 truncate flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span>{label}</span>
            </h3>
          </div>
        )}
      </div>
      
      {/* Add Action Button */}
      {config && (
        <button
          onClick={handleAddAction}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-10 border-4 border-white"
        >
          <PlusIcon className="w-5 h-5 text-white font-bold" />
        </button>
      )}
    </BaseNode>
  );
};
