// Main workflow canvas component with React Flow

"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/store/workflow.store";
import { nodeTypes } from "@/components/nodes";
import type { WorkflowNode, WorkflowEdge } from "@/lib/worker-types";
import { CanvasControls } from "./controls";
import { ExecutionLogs } from "../execution-logs";

interface WorkflowCanvasProps {
  className?: string;
  activeTab?: "builder" | "executions" | "published";
  executions?: Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>;
  testExecutions?: Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ 
  className, 
  activeTab = "builder",
  executions = [],
  testExecutions = []
}) => {
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    setNodes,
    setEdges,
    selectNode,
    selectEdge,
    clearSelection,
  } = useWorkflowStore();

  // Convert store nodes/edges to React Flow format
  const reactFlowNodes: Node[] = useMemo(() => {
    const mappedNodes: Node[] = nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));

    // Always add the "Add New Trigger" button after all triggers
    const startNodes = nodes.filter((n) => n.type === "start");
    const triggerWidth = 312; // Match actual trigger node width
    const horizontalSpacing = 30;
    const baseY = 80;
    const baseX = 120;
    
    // Calculate position for the add trigger button
    let addTriggerX = baseX;
    if (startNodes.length > 0) {
      const rightMost = startNodes.reduce(
        (max, n) => Math.max(max, (n.position?.x || 0) + ((n.measured?.width as number) || triggerWidth)),
        0
      );
      addTriggerX = rightMost + horizontalSpacing;
    }

    const addTriggerNode: Node = {
      id: 'add-trigger-button',
      type: 'addTrigger',
      position: { x: addTriggerX, y: baseY },
      data: {},
      draggable: false,
      selectable: false,
      selected: false,
      measured: {
        width: triggerWidth,
        height: 48,
      },
    };

    mappedNodes.push(addTriggerNode);

    // Debug logging
    console.log('Add Trigger Button Position:', { x: addTriggerX, y: baseY });
    console.log('Total nodes in canvas:', mappedNodes.length);
    console.log('Start nodes count:', startNodes.length);

    return mappedNodes;
  }, [nodes, selectedNodeId]);

  const reactFlowEdges: Edge[] = useMemo(
    () => {
      return edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        type: "smoothstep",
        selected: edge.id === selectedEdgeId,
        animated: false,
        style: {
          stroke: edge.id === selectedEdgeId ? "#3b82f6" : "#2563eb", 
          strokeWidth: edge.id === selectedEdgeId ? 5 : 4 
        },
      }));
    },
    [edges, selectedEdgeId]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      // Don't select the "Add Trigger" button node
      if (node.id === 'add-trigger-button') return;
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  // Handle canvas click (clear selection)
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Handle node changes using React Flow's built-in function
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as WorkflowNode[];
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  // Handle edge changes using React Flow's built-in function
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges) as WorkflowEdge[];
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge = {
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || null,
          targetHandle: connection.targetHandle || null,
        };
        const updatedEdges = addEdge(newEdge, edges) as WorkflowEdge[];
        setEdges(updatedEdges);
      }
    },
    [edges, setEdges]
  );


  // Fit view when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: 0.2, 
          minZoom: 0.1, 
          maxZoom: 1.5
        });
      }, 100);
    }
  }, [nodes.length, reactFlowInstance]);

  return (
    <div
      ref={containerRef}
      className={`${selectedNodeId ? "w-[70vw]" : "w-[100vw]"} h-full relative ${
        className || ""
      }`}
    >

      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={false}
        nodesConnectable={true}
        elementsSelectable={true}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: '#2563eb', 
            strokeWidth: 4 
          }
        }}
      >
        <Background />
      </ReactFlow>

      {/* Canvas Controls */}
      <CanvasControls />

      {/* Execution Logs Overlay */}
      {activeTab === "executions" && executions.length > 0 && (
        <ExecutionLogs executions={executions} testExecutions={testExecutions} />
      )}
    </div>
  );
};

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};
