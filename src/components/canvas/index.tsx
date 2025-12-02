// Main workflow canvas component with React Flow

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
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
import { useWorkflowWorker } from "@/hooks/useWorkflowWorker";
// removed default canvas options and minimap
import { v4 as uuidv4 } from "uuid";
import { EMPTY_ACTION_NODE, EMPTY_TRIGGER_NODE } from "@/store/workflow.store";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "../ui/hover-card";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface WorkflowCanvasProps {
  className?: string;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({ className }) => {
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [workflowName, setWorkflowName] = useState("My workflow");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("My workflow");
  const [active, setActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "executions" | "published">("editor");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [workflowOwner] = useState("John Doe"); // In real app, get from auth
  const [workflowCreated] = useState(new Date("2024-11-01"));
  const [workflowId] = useState(() => `wf_${Math.random().toString(36).substring(2, 11)}`);
  
  // Initialize lastSaved on client only
  useEffect(() => {
    if (!lastSaved) {
      setLastSaved(new Date());
    }
  }, [lastSaved]);
  const [executions] = useState(
    [
      { id: 62, workflow: "My workflow", status: "Error",   started: "Starting soon",     runtime: "-0.002s" },
      { id: 61, workflow: "My workflow", status: "Success", started: "Nov 6, 14:54:56",   runtime: "1.354s" },
      { id: 60, workflow: "My workflow", status: "Success", started: "Nov 6, 14:39:23",   runtime: "1.696s" },
      { id: 59, workflow: "My workflow", status: "Success", started: "Nov 6, 14:37:21",   runtime: "204ms"  },
    ] as Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>
  );
  const [testExecutions] = useState(
    [
      { id: 5, workflow: "My workflow", status: "Success", started: "Nov 7, 10:01:22", runtime: "418ms" },
      { id: 4, workflow: "My workflow", status: "Success", started: "Nov 7, 09:59:03", runtime: "1.012s" },
    ] as Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>
  );
  const [showTestExecutions, setShowTestExecutions] = useState(false);

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
    undo,
    redo,
    canUndo,
    canRedo,
    getHistory,
    setLayouting,
  } = useWorkflowStore();

  const { isReady, computeLayout } = useWorkflowWorker();

  const onZoomIn = () => {
    reactFlowInstance.zoomIn();
  };
  const onZoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const onFixLayout = useCallback(async () => {
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

  const onAddActionOrTrigger = () => {
    const newNode: WorkflowNode = {
      ...(EMPTY_ACTION_NODE as WorkflowNode),
      id: uuidv4(),
      position: { x: 400, y: 240 },
    };
    useWorkflowStore.getState().addNode(newNode);
  };

  const onAddTrigger = () => {
    const currentStartNodes = nodes.filter((n) => n.type === "start");
    const baseY = 80;
    const horizontalSpacing = 30; // Space between triggers
    const triggerWidth = (EMPTY_TRIGGER_NODE.measured?.width as number) || 336;
    let newX = 120; // Start position for first trigger
    
    if (currentStartNodes.length > 0) {
      // Find the rightmost trigger and add spacing
      const rightMost = currentStartNodes.reduce(
        (max, n) => Math.max(max, (n.position?.x || 0) + ((n.measured?.width as number) || triggerWidth)),
        0
      );
      newX = rightMost + horizontalSpacing;
    }
    
    const newTrigger: WorkflowNode = {
      id: uuidv4(),
      type: "start",
      position: { x: newX, y: baseY },
      measured: { 
        width: triggerWidth, 
        height: (EMPTY_TRIGGER_NODE.measured?.height as number) || 78 
      },
      data: {
        label: "Trigger",
        labelIcon: "trigger",
      },
    };
    useWorkflowStore.getState().addNode(newTrigger);
  };

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

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        if (canUndo()) {
          undo();
        }
      } else if (
        ((event.ctrlKey || event.metaKey) && event.key === "y") ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "Z")
      ) {
        event.preventDefault();
        if (canRedo()) {
          redo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

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
      className={`${selectedNodeId ? "w-[70vw]" : "w-[100vw]"} h-full ${
        className || ""
      }`}
    >
      {/* Header bar with requested controls */}
      <TooltipProvider>
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center px-4 py-3 bg-white border-b">
          {/* Left: Back button + Workflow name */}
          <div className="flex items-center gap-3 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back to workflows list</p>
              </TooltipContent>
            </Tooltip>
          
          {!editingName ? (
            <button
              className="text-base font-medium text-gray-900 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              onClick={() => {
                setNameDraft(workflowName);
                setEditingName(true);
              }}
              title="Edit workflow name"
            >
              {workflowName || "Workflow name"}
            </button>
          ) : (
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="h-8 px-2 bg-transparent border border-gray-300 rounded text-base text-gray-900 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Workflow name"
              aria-label="Edit workflow name"
              autoFocus
              onBlur={() => {
                setWorkflowName(nameDraft.trim() || "Workflow name");
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setWorkflowName(nameDraft.trim() || "Workflow name");
                  setEditingName(false);
                }
                if (e.key === "Escape") {
                  setNameDraft(workflowName);
                  setEditingName(false);
                }
              }}
            />
          )}
        </div>

          {/* Center: Tabs */}
          <div className="flex items-center gap-1 flex-1 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "editor" 
                      ? "text-blue-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editor
                  {activeTab === "editor" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit and design your workflow</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("executions")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "executions" 
                      ? "text-blue-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Execution logs
                  {activeTab === "executions" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View workflow execution history and logs</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "published" 
                      ? "text-blue-600" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Published version
                  {activeTab === "published" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View the published version of your workflow</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Draft saved status */}
            <div className="text-sm text-gray-500" suppressHydrationWarning>
              {isSaving ? "Saving..." : "Draft saved"}
            </div>
            
            {/* History/Clock icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Version history</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Play/Test button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Test workflow</p>
              </TooltipContent>
            </Tooltip>

          {/* Active toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Active</span>
                <button
                  onClick={() => setActive((v) => !v)}
                  className={`w-11 h-6 rounded-full border relative transition-colors ${
                    active ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"
                  }`}
                  aria-label="Toggle active"
                  aria-pressed={active}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transform transition-transform ${
                      active ? "translate-x-[26px]" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{active ? "Workflow is active. Click to deactivate." : "Workflow is inactive. Click to activate."}</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Save & publish button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                onClick={() => {
                  setIsSaving(true);
                  setTimeout(() => {
                    setIsSaving(false);
                setLastSaved(new Date());
              }, 1000);
            }}
          >
            Save &amp; publish
          </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save and publish workflow</p>
            </TooltipContent>
          </Tooltip>
          </div>
        </div>
      </TooltipProvider>

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
        
        <MiniMap
          nodeStrokeColor={(node: Node) => {
            if (node.type === 'start') return '#3b82f6';
            if (node.type === 'end') return '#10b981';
            if (node.type === 'action') return '#8b5cf6';
            if (node.type === 'condition') return '#f59e0b';
            return '#6b7280';
          }}
          nodeColor={(node: Node) => {
            if (node.type === 'start') return '#dbeafe';
            if (node.type === 'end') return '#d1fae5';
            if (node.type === 'action') return '#ede9fe';
            if (node.type === 'condition') return '#fed7aa';
            return '#f3f4f6';
          }}
          nodeBorderRadius={8}
          maskColor="rgb(240, 240, 240, 0.6)"
          className="bg-white border rounded-lg shadow-md"
          position="bottom-right"
        />
        <Controls 
          className="bg-white border rounded-lg shadow-md" 
          showInteractive={false}
        />
      </ReactFlow>

      {/* Removed old canvas options and minimap as requested */}

      {/* Executions table view (overlay, hides canvas behind) */}
      {activeTab === "executions" && (
        <div className="absolute top-14 left-4 right-4 bottom-4 z-20 bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="h-full w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-3 font-medium">Workflow</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium">Run Time</th>
                  <th className="px-4 py-3 font-medium">Exec. ID</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((row) => {
                  const isError = row.status === "Error";
                  return (
                    <tr key={row.id} className={`border-b last:border-b-0 ${isError ? "bg-red-50/70" : ""}`}>
                      <td className="px-4 py-3 text-gray-900">{row.workflow}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              isError ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          <span className={`${isError ? "text-red-700" : "text-green-700"}`}>{row.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.started}</td>
                      <td className="px-4 py-3 text-gray-800">{row.runtime}</td>
                      <td className="px-4 py-3 text-gray-800">{row.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3 text-gray-600">
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="Details">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M10 3v4L5 17a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-10V3zM9 7h6" />
                            </svg>
                          </button>
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="More">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <circle cx="12" cy="6" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="18" r="1.5" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showTestExecutions && (
        <div className="absolute top-14 left-4 right-4 bottom-4 z-30 bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="h-full w-full overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <div className="text-sm font-medium text-gray-800">Test Executions</div>
              <button
                className="px-2 h-8 rounded-md border bg-white text-sm"
                onClick={() => setShowTestExecutions(false)}
                title="Close"
              >
                Close
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-3 font-medium">Workflow</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium">Run Time</th>
                  <th className="px-4 py-3 font-medium">Exec. ID</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testExecutions.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                      No test executions yet
                    </td>
                  </tr>
                )}
                {testExecutions.map((row) => {
                  const isError = row.status === "Error";
                  return (
                    <tr key={row.id} className={`border-b last:border-b-0 ${isError ? "bg-red-50/70" : ""}`}>
                      <td className="px-4 py-3 text-gray-900">{row.workflow}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              isError ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          <span className={`${isError ? "text-red-700" : "text-green-700"}`}>{row.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.started}</td>
                      <td className="px-4 py-3 text-gray-800">{row.runtime}</td>
                      <td className="px-4 py-3 text-gray-800">{row.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3 text-gray-600">
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="Details">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M10 3v4L5 17a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-10V3zM9 7h6" />
                            </svg>
                          </button>
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="More">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <circle cx="12" cy="6" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="18" r="1.5" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom-left controls: zoom, undo/redo, keyboard shortcuts */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-md border p-1">
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center"
              onClick={onZoomOut}
            >
              <span className="text-lg leading-none">−</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Zoom out
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center"
              onClick={onZoomIn}
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Zoom in
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center"
              onClick={onAddActionOrTrigger}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 4h4v4h-4zM4 10h4v4H4zM10 16h4v4h-4zM16 10h4v4h-4z" />
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Add node
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center"
              onClick={onAddTrigger}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-6 5h12v2H6v-2zm-2 4h16v2H4v-2z" />
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Add trigger
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className={`w-8 h-8 rounded-md border bg-white grid place-items-center ${
                !canUndo() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={undo}
              disabled={!canUndo()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M7 7L3 11L7 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 17a8 8 0 0 0-8-8H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Undo (Ctrl+Z)
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className={`w-8 h-8 rounded-md border bg-white grid place-items-center ${
                !canRedo() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={redo}
              disabled={!canRedo()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 7L21 11L17 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17a8 8 0 0 1 8-8h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Redo (Ctrl+Y)
          </HoverCardContent>
        </HoverCard>

        {/* Fix Layout */}
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center hover:bg-blue-50"
              onClick={onFixLayout}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Fix Layout
          </HoverCardContent>
        </HoverCard>

        {/* Fit to Screen */}
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center hover:bg-gray-50"
              onClick={() => reactFlowInstance.fitView({ padding: 0.2, minZoom: 0.1, maxZoom: 1.5 })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M16 21h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Fit to Screen
          </HoverCardContent>
        </HoverCard>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Keyboard Shortcuts */}
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <button
              className="w-8 h-8 rounded-md border bg-white grid place-items-center hover:bg-gray-50"
              onClick={() => setShowKeyboardShortcuts(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="py-1 px-2 text-xs w-auto">
            Keyboard Shortcuts (?)
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Undo</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Redo</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+Y</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Save</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delete Node</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Del</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duplicate Node</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+D</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Zoom In</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">+</kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Zoom Out</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">-</kbd>
              </div>
            </div>
          </div>
        </div>
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
