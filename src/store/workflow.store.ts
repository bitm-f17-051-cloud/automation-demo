// Zustand store for workflow state management
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type {
  WorkflowNode,
  WorkflowEdge,
  ExecutionProgress,
  ExecutionResult,
} from "@/lib/worker-types";
import { v4 as uuidv4 } from "uuid";

// History types for undo/redo functionality
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  state: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
}

// Ring buffer implementation for state history (undo/redo)
class StateHistoryRingBuffer {
  private buffer: HistoryEntry[];
  private size: number;
  private currentIndex: number;
  private length: number;
  private maxIndex: number; // Track the maximum valid index for redo

  constructor(size: number = 50) {
    this.buffer = new Array(size);
    this.size = size;
    this.currentIndex = -1;
    this.length = 0;
    this.maxIndex = -1;
  }

  push(entry: HistoryEntry): void {
    this.currentIndex = (this.currentIndex + 1) % this.size;
    this.buffer[this.currentIndex] = entry;
    this.length = Math.min(this.length + 1, this.size);
    this.maxIndex = this.currentIndex; // Update max index when new entry is added
  }

  canUndo(): boolean {
    return this.length > 1;
  }

  canRedo(): boolean {
    return this.currentIndex !== this.maxIndex && this.length > 0;
  }

  undo(): HistoryEntry | null {
    if (!this.canUndo()) return null;
    
    // Move to previous entry
    this.currentIndex = (this.currentIndex - 1 + this.size) % this.size;
    return this.buffer[this.currentIndex];
  }

  redo(): HistoryEntry | null {
    if (!this.canRedo()) return null;
    
    // Move to next entry
    this.currentIndex = (this.currentIndex + 1) % this.size;
    return this.buffer[this.currentIndex];
  }

  getCurrent(): HistoryEntry | null {
    return this.length > 0 ? this.buffer[this.currentIndex] : null;
  }

  clear(): void {
    this.buffer = new Array(this.size);
    this.currentIndex = -1;
    this.length = 0;
    this.maxIndex = -1;
  }
}

// Simple array for action history display (includes undo/redo actions)
class ActionHistoryLog {
  private actions: HistoryEntry[];
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.actions = [];
    this.maxSize = maxSize;
  }

  push(entry: HistoryEntry): void {
    this.actions.unshift(entry); // Add to beginning for chronological order
    if (this.actions.length > this.maxSize) {
      this.actions.pop(); // Remove oldest
    }
  }

  getHistory(): HistoryEntry[] {
    return [...this.actions];
  }

  clear(): void {
    this.actions = [];
  }
}

const START_NODE_DEFAULT_ID = uuidv4();
const END_NODE_DEFAULT_ID = uuidv4();

export const DEFAULT_NODE_X_POSITION = 168;
export const DEFAULT_ACTION_NODE_WIDTH = 312;
export const DEFAULT_NODES_SPACING = 100;
export const CONDITION_NODE_SPACING = 400; // Horizontal spacing between condition nodes
export const CONDITION_NODE_WIDTH = 312;

export const EMPTY_TRIGGER_NODE: WorkflowNode = {
  id: START_NODE_DEFAULT_ID,
  type: "start",
  position: { x: 48, y: 80 },
  measured: { width: 312, height: 48 },
  data: {
    label: "Trigger",
    labelIcon: "trigger",
  },
};

export const EMPTY_ACTION_NODE: WorkflowNode = {
  id: "",
  type: "action",
  position: { x: 48, y: 180 },
  measured: { width: 312, height: 48 },
  data: {
    label: "Add action",
  },
};

export const EMPTY_CONDITION_NODE: WorkflowNode = {
  id: "",
  type: "condition",
  position: { x: 0, y: 0 },
  measured: { width: 312, height: 48 },
  data: {
    label: "Add condition",
  },
};

export const EMPTY_INTERMEDIATE_NODE: WorkflowNode = {
  id: "",
  type: "intermediate",
  position: { x: 0, y: 0 },
  measured: { width: 312, height: 48 },
  data: {
    label: "",
  },
};

export const EMPTY_END_NODE: WorkflowNode = {
  id: END_NODE_DEFAULT_ID,
  type: "end",
  position: { x: 147, y: 280 },
  measured: { width: 42, height: 24 },
  data: {
    label: "End",
  },
};

export const DEFAULT_EDGES: WorkflowEdge[] = [
  {
    id: START_NODE_DEFAULT_ID,
    source: START_NODE_DEFAULT_ID,
    target: END_NODE_DEFAULT_ID,
    sourceHandle: "output",
    targetHandle: "input",
  },
];

const cloneNodeTemplate = (
  template: WorkflowNode,
  overrides: Partial<WorkflowNode> = {}
): WorkflowNode => {
  const {
    data: overrideData,
    position: overridePosition,
    measured: overrideMeasured,
    id: overrideId,
    ...restOverrides
  } = overrides;

  return {
    ...template,
    ...restOverrides,
    id: overrideId ?? uuidv4(),
    position: {
      x: overridePosition?.x ?? template.position?.x ?? 0,
      y: overridePosition?.y ?? template.position?.y ?? 0,
    },
    measured: overrideMeasured
      ? { ...overrideMeasured }
      : template.measured
        ? { ...template.measured }
        : undefined,
    data: {
      ...template.data,
      ...(overrideData || {}),
    },
  };
};

export interface WorkflowState {
  // Workflow data
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];

  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectedNodeType: string | null;
  isLayouting: boolean;

  // Execution state
  executionHistory: ExecutionResult[];
  currentExecution: ExecutionResult | null;
  executionProgress: ExecutionProgress[];

  // History state
  stateHistory: StateHistoryRingBuffer; // For undo/redo functionality
  actionHistory: ActionHistoryLog; // For display in history panel
  isUndoRedoAction: boolean;

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  updateNodeConfig: (
    nodeId: string,
    config: WorkflowNode["data"]["config"],
    shouldAddEmptyActionNode?: boolean,
    noOfBranches?: number,
    branches?: WorkflowNode["data"]["config"][]
  ) => void;
  updateConditionNodeConfig: (
    nodeId: string,
    branches: WorkflowNode["data"]["config"][],
    branchesToDelete?: string[]
  ) => void;
  addEmptyActionNode: (nodeId: string) => void;
  addEmptyConditionNodes: (
    nodeId: string,
    numberOfConditions?: number,
    branches?: WorkflowNode["data"]["config"][]
  ) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection actions
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearSelection: () => void;

  // Layout actions
  setLayouting: (isLayouting: boolean) => void;

  // Execution actions
  setExecutionProgress: (progress: ExecutionProgress[]) => void;
  addExecutionProgress: (progress: ExecutionProgress) => void;
  setCurrentExecution: (execution: ExecutionResult | null) => void;
  addExecutionToHistory: (execution: ExecutionResult) => void;
  clearExecutionProgress: () => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getHistory: () => HistoryEntry[];
  addToHistory: (action: string, description: string) => void;

  // Workflow actions
  resetWorkflow: () => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  devtools(
    subscribeWithSelector((set, get) => {
      const initialNodes = [cloneNodeTemplate(EMPTY_TRIGGER_NODE)];
      
      const initialEdges: WorkflowEdge[] = [];
      
      const stateHistory = new StateHistoryRingBuffer(50);
      const actionHistory = new ActionHistoryLog(100);
      
      // Add initial state to state history only (not action history)
      const initialEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        action: "initialize",
        description: "Initial workflow state",
        state: {
          nodes: JSON.parse(JSON.stringify(initialNodes)),
          edges: JSON.parse(JSON.stringify(initialEdges)),
        },
      };
      stateHistory.push(initialEntry);
      // Don't add to actionHistory - user doesn't need to see initial state

      return {
        // Initial state
        nodes: initialNodes,
        edges: initialEdges,
        selectedNodeId: null,
        selectedEdgeId: null,
        selectedNodeType: null,
        isLayouting: false,
        executionHistory: [],
        currentExecution: null,
        executionProgress: [],
        stateHistory,
        actionHistory,
        isUndoRedoAction: false,

      // Node actions
      setNodes: (nodes) => set({ nodes }, false, "setNodes"),

      setEdges: (edges) => set({ edges }, false, "setEdges"),

      addNode: (node) => {
        // Only track manually added nodes, not automatic ones
        const state = get();
        if (!state.isUndoRedoAction) {
          get().addToHistory("addNode", `Added ${node.type} node`);
        }
        set((state) => ({ nodes: [...state.nodes, node] }), false, "addNode");
      },

      updateNode: (nodeId, updates) => {
        get().addToHistory("updateNode", `Updated node ${nodeId}`);
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId ? { ...node, ...updates } : node
            ),
          }),
          false,
          "updateNode"
        );
      },

      updateNodeConfig: (
        nodeId: string,
        config: WorkflowNode["data"]["config"],
        shouldAddEmptyActionNode: boolean = true,
        noOfBranches: number = 2,
        branches = []
      ) => {
        // First update the node config
        set(
          (state: WorkflowState) => {
            const updatedNodes: WorkflowNode[] = state.nodes.map(
              (node: WorkflowNode) => {
                if (node.id !== nodeId) {
                  return node;
                }

                const isConditionalBranching =
                  config?.nodeName === "If/Else" || config?.nodeName === "Router";

                return {
                  ...node,
                  ...(isConditionalBranching && { type: "intermediate" }),
                  ...(isConditionalBranching && {
                    measured: {
                      width: 312,
                      height: 48,
                    },
                    width: 312,
                    height: 48,
                  }),
                  data: {
                    ...node.data,
                    label: config?.nodeName,
                    config: { ...node.data.config, ...config },
                    branches: branches,
                  },
                };
              }
            );

            return { nodes: updatedNodes };
          },
          false,
          "updateNodeConfig"
        );
        
        // Then add empty nodes if needed
        if (shouldAddEmptyActionNode) {
          if (config?.nodeName === "If/Else" || config?.nodeName === "Router") {
            get().addEmptyConditionNodes(nodeId, noOfBranches, branches);
          } else {
            get().addEmptyActionNode(nodeId);
          }
        }
        
        // Finally, add to history AFTER all automatic nodes are added
        setTimeout(() => {
          const state = get();
          if (!state.isUndoRedoAction) {
            get().addToHistory("updateNodeConfig", `Updated node config for ${config?.nodeName || 'node'}`);
          }
        }, 0);
      },

      updateConditionNodeConfig: (
        nodeId,
        branches = [],
        branchesToDelete = []
      ) => {
        const result = set(
          (state) => {
            const tempNodes: WorkflowNode[] = JSON.parse(
              JSON.stringify(state.nodes)
            );
            const tempEdges: WorkflowEdge[] = JSON.parse(
              JSON.stringify(state.edges)
            );

            const updatedNodes = tempNodes.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      branches: branches,
                    },
                  }
                : node
            );

            const nodesToDelete = new Set<string>();
            const edgesToDelete = new Set<string>();

            // First, find all condition nodes that need to be deleted
            const conditionNodesToDelete = updatedNodes.filter(
              (node) =>
                branchesToDelete.includes(node.data.label) &&
                node.type === "condition"
            );

            // For each condition node to delete, find all connected nodes in the branch
            for (const conditionNode of conditionNodesToDelete) {
              nodesToDelete.add(conditionNode.id);

              // Find and delete incoming edges to this condition node (from intermediate node)
              const incomingEdges = tempEdges.filter(
                (edge) => edge.target === conditionNode.id
              );
              for (const edge of incomingEdges) {
                edgesToDelete.add(edge.id);
              }

              // Find all nodes connected to this condition node (action nodes, end nodes, etc.)
              const findConnectedNodes = (nodeId: string) => {
                // Find edges that start from this node
                const outgoingEdges = tempEdges.filter(
                  (edge) => edge.source === nodeId
                );

                for (const edge of outgoingEdges) {
                  nodesToDelete.add(edge.target);
                  edgesToDelete.add(edge.id);

                  // Recursively find nodes connected to the target node
                  const targetNode = updatedNodes.find(
                    (n) => n.id === edge.target
                  );
                  if (targetNode && targetNode.type !== "end") {
                    findConnectedNodes(edge.target);
                  }
                }
              };

              findConnectedNodes(conditionNode.id);
            }

            // Remove all identified nodes and edges
            const filteredNodes = updatedNodes.filter(
              (node) => !nodesToDelete.has(node.id)
            );
            const filteredEdges = tempEdges.filter(
              (edge) => !edgesToDelete.has(edge.id)
            );

            // Update the arrays
            updatedNodes.length = 0;
            updatedNodes.push(...filteredNodes);
            tempEdges.length = 0;
            tempEdges.push(...filteredEdges);

            const intermediateConditionNodeIds = state.edges
              .filter((edge) => edge.source === nodeId)
              .map((edge) => edge.target);
            const conditionNodes = updatedNodes.filter((node) =>
              intermediateConditionNodeIds.includes(node.id)
            );

            const totalWidth = (branches.length - 1) * CONDITION_NODE_SPACING;
            const startX = DEFAULT_NODE_X_POSITION - totalWidth / 2;

            const newNodes = [];
            const newEdges = [];

            for (const [index, branch] of branches.entries()) {
              if (branch) {
                const conditionNode = conditionNodes[index];
                if (conditionNode) {
                  conditionNode.data.label = branch.nodeName;
                  conditionNode.data.config = branch;

                  // Update the corresponding node in updatedNodes with new label and config
                  updatedNodes.forEach((n) => {
                    if (n.id === conditionNode.id) {
                      n.data.label = branch.nodeName;
                      n.data.config = branch;
                    }
                  });
                } else {
                  const conditionNode = {
                    ...EMPTY_CONDITION_NODE,
                    id: uuidv4(),
                    position: {
                      x:
                        startX +
                        index * CONDITION_NODE_SPACING -
                        CONDITION_NODE_WIDTH / 2,
                      y: DEFAULT_NODES_SPACING,
                    },
                    data: {
                      ...EMPTY_CONDITION_NODE.data,
                      label: branch.nodeName,
                      config: branch,
                    },
                  };

                  const actionNode = {
                    ...EMPTY_ACTION_NODE,
                    id: uuidv4(),
                    position: {
                      x:
                        conditionNode.position.x +
                        CONDITION_NODE_WIDTH / 2 -
                        DEFAULT_ACTION_NODE_WIDTH / 2,
                      y: 85 + DEFAULT_NODES_SPACING,
                    },
                  };

                  const endNode = {
                    ...EMPTY_END_NODE,
                    id: uuidv4(),
                    position: {
                      x:
                        conditionNode.position.x +
                        CONDITION_NODE_WIDTH / 2 -
                        EMPTY_END_NODE.measured!.width / 2,
                      y:
                        32 +
                        DEFAULT_NODES_SPACING * 2 +
                        DEFAULT_ACTION_NODE_WIDTH,
                    },
                  };

                  newNodes.push(conditionNode, actionNode, endNode);

                  newEdges.push({
                    id: `${nodeId}-${conditionNode.id}`,
                    source: nodeId,
                    target: conditionNode.id,
                    sourceHandle: "output",
                    targetHandle: "input",
                  });

                  // Connect condition node to action node
                  newEdges.push({
                    id: `${conditionNode.id}-${actionNode.id}`,
                    source: conditionNode.id,
                    target: actionNode.id,
                    sourceHandle: "output",
                    targetHandle: "input",
                  });

                  // Connect action node to end node
                  newEdges.push({
                    id: `${actionNode.id}-${endNode.id}`,
                    source: actionNode.id,
                    target: endNode.id,
                    sourceHandle: "output",
                    targetHandle: "input",
                  });
                }
              }
            }

            return {
              nodes: [...updatedNodes, ...newNodes],
              edges: [...tempEdges, ...newEdges],
            };
          },
          false,
          "updateConditionNodeConfig"
        );
        
        // Add to history after the update is complete
        setTimeout(() => {
          const state = get();
          if (!state.isUndoRedoAction) {
            get().addToHistory("updateConditionNodeConfig", `Updated condition branches`);
          }
        }, 0);
        
        return result;
      },

      addEmptyActionNode: (nodeId) => {
        // Don't track empty node additions in history as they're automatic
        return set(
          (state) => {
            const updatedNodes = JSON.parse(JSON.stringify(state.nodes));
            const tempEdges = JSON.parse(JSON.stringify(state.edges));

            const actionNodeIndex = updatedNodes.findIndex(
              (node: WorkflowNode) => node.id === nodeId
            );
            const nodeBeforeEmptyActionNode = updatedNodes[actionNodeIndex];

            // Check if this is a trigger node and if there are multiple configured triggers
            const isTriggerNode = nodeBeforeEmptyActionNode.type === "start";
            const configuredTriggers = updatedNodes.filter(
              (node: WorkflowNode) => 
                node.type === "start" && 
                node.data?.config && 
                node.id !== nodeId
            );

            // If multiple triggers exist, connect them all directly to the action node
            if (isTriggerNode && configuredTriggers.length > 0) {
              // Find the action node that the first configured trigger connects to (if any)
              const firstTrigger = configuredTriggers[0];
              const firstTriggerEdge = tempEdges.find(
                (edge: WorkflowEdge) => edge.source === firstTrigger.id
              );
              let actionNode = firstTriggerEdge
                ? updatedNodes.find((node: WorkflowNode) => node.id === firstTriggerEdge.target)
                : null;

              // If no existing action node, create a new one
              if (!actionNode) {
                actionNode = cloneNodeTemplate(EMPTY_ACTION_NODE, {
                  position: {
                    x: DEFAULT_NODE_X_POSITION - DEFAULT_ACTION_NODE_WIDTH / 2,
                    y: nodeBeforeEmptyActionNode.position.y + 48 + DEFAULT_NODES_SPACING,
                  },
                });
                updatedNodes.push(actionNode);

                // Update end node position if it exists
                const endNode = updatedNodes.find(
                  (node: WorkflowNode) => node.type === "end"
                );
                if (endNode) {
                  endNode.position.y =
                    actionNode.position.y +
                    (actionNode.measured?.height ?? 0) +
                    DEFAULT_NODES_SPACING;
                }
              }

              // Connect all configured triggers directly to the action node
              configuredTriggers.forEach((trigger: WorkflowNode) => {
                // Check if trigger already has an edge to this action node
                const existingEdge = tempEdges.find(
                  (edge: WorkflowEdge) => edge.source === trigger.id && edge.target === actionNode!.id
                );
                if (!existingEdge) {
                  // Remove any existing edge from this trigger (might be to merge node or different action)
                  const oldEdge = tempEdges.find(
                    (edge: WorkflowEdge) => edge.source === trigger.id
                  );
                  if (oldEdge) {
                    const edgeIndex = tempEdges.findIndex(
                      (edge: WorkflowEdge) => edge.id === oldEdge.id
                    );
                    if (edgeIndex !== -1) {
                      tempEdges.splice(edgeIndex, 1);
                    }
                  }
                  // Add new edge directly to action node
                  const triggerToActionEdge = {
                    id: `edge-${trigger.id}-${actionNode!.id}`,
                    source: trigger.id,
                    target: actionNode!.id,
                    sourceHandle: "output",
                    targetHandle: "input",
                  };
                  tempEdges.push(triggerToActionEdge);
                }
              });

              // Connect current trigger directly to the action node
              const currentTriggerEdge = {
                id: `edge-${nodeId}-${actionNode.id}`,
                source: nodeId,
                target: actionNode.id,
                sourceHandle: "output",
                targetHandle: "input",
              };
              tempEdges.push(currentTriggerEdge);

              return {
                nodes: updatedNodes,
                edges: tempEdges,
                selectedNodeId: actionNode.id,
                selectedNodeType: "action",
              };
            }

            const endNodeId = tempEdges.find(
              (edge: WorkflowEdge) => edge.source === nodeId
            )?.target;
            const endNode = updatedNodes.find(
              (node: WorkflowNode) => node.id === endNodeId
            );

            let previousNodeHeight =
              nodeBeforeEmptyActionNode.measured?.height ?? 48;

            const newActionNode = cloneNodeTemplate(EMPTY_ACTION_NODE, {
              position: {
                x: DEFAULT_NODE_X_POSITION - DEFAULT_ACTION_NODE_WIDTH / 2,
                y:
                  nodeBeforeEmptyActionNode.position.y +
                  previousNodeHeight +
                  DEFAULT_NODES_SPACING,
              },
            });

            // Only update end node position if it exists
            if (endNode) {
              endNode.position.y =
                newActionNode.position.y +
                (newActionNode.measured?.height ?? 0) +
                DEFAULT_NODES_SPACING;
            }

            updatedNodes.splice(actionNodeIndex + 1, 0, newActionNode);
            
            // Handle edges
            const lastEdge = tempEdges.find(
              (edge: WorkflowEdge) => edge.source === nodeId
            );
            
            let newEdges = tempEdges;
            if (lastEdge) {
              // Update existing edge to point to new action node
              const lastEdgeTarget = lastEdge.target;
              lastEdge.target = newActionNode.id;
              
              // Create new edge from action node to previous target
              const newEdge = {
                id: newActionNode.id,
                source: newActionNode.id,
                target: lastEdgeTarget,
                sourceHandle: "output",
                targetHandle: "input",
              };
              newEdges = [...tempEdges, newEdge];
            } else {
              // No existing edge, just create one from previous node to action node
              const newEdge = {
                id: `edge-${nodeId}-${newActionNode.id}`,
                source: nodeId,
                target: newActionNode.id,
                sourceHandle: "output",
                targetHandle: "input",
              };
              newEdges = [...tempEdges, newEdge];
            }

            return {
              nodes: updatedNodes,
              edges: newEdges,
              selectedNodeId: newActionNode.id,
              selectedNodeType: "action",
            };
          },
          false,
          "addEmptyActionNode"
        );
      },

      addEmptyConditionNodes: (
        nodeId,
        numberOfConditions = 2,
        branches = [{}] as WorkflowNode["data"]["config"][]
      ) => {
        // Don't track empty condition node additions in history as they're automatic
        return set(
          (state) => {
            const updatedNodes = JSON.parse(JSON.stringify(state.nodes));
            const updatedEdges = JSON.parse(JSON.stringify(state.edges));

            // Find the outgoing edge from this node
            const outgoingEdge = updatedEdges.find(
              (edge: WorkflowEdge) => edge.source === nodeId
            );
            
            // Find the node we're adding conditions from
            const nodeBeforeEndIndex = updatedNodes.findIndex(
              (node: WorkflowNode) => node.id === nodeId
            );
            const nodeBeforeEnd = updatedNodes[nodeBeforeEndIndex];
            
            // Find the target node if there's an outgoing edge
            let endNodeIndex = -1;
            let endEdgeIndex = -1;
            
            if (outgoingEdge) {
              endNodeIndex = updatedNodes.findIndex(
                (node: WorkflowNode) => node.id === outgoingEdge.target
              );
              endEdgeIndex = updatedEdges.findIndex(
                (edge: WorkflowEdge) => edge.source === nodeId
              );
            }

            let previousNodeHeight = nodeBeforeEnd.measured?.height ?? 48;

            const baseY =
              nodeBeforeEnd.position.y +
              previousNodeHeight +
              DEFAULT_NODES_SPACING;

            // Calculate total width needed for all condition nodes
            const totalWidth =
              (numberOfConditions - 1) * CONDITION_NODE_SPACING;
            const startX = DEFAULT_NODE_X_POSITION - totalWidth / 2;

            const newNodes = [];
            const newEdges = [];

            // Create nodes for each condition
            for (let i = 0; i < numberOfConditions; i++) {
              const conditionNode = {
                ...EMPTY_CONDITION_NODE,
                id: uuidv4(),
                position: {
                  x:
                    startX +
                    i * CONDITION_NODE_SPACING -
                    CONDITION_NODE_WIDTH / 2,
                  y: baseY,
                },
                data: {
                  ...EMPTY_CONDITION_NODE.data,
                  label: branches[i]?.nodeName ?? "",
                  config: branches[i] ?? {},
                },
              };

              // Create an action node for this condition branch
              const actionNode = {
                ...EMPTY_ACTION_NODE,
                id: uuidv4(),
                position: {
                  x:
                    conditionNode.position.x +
                    CONDITION_NODE_WIDTH / 2 -
                    DEFAULT_ACTION_NODE_WIDTH / 2,
                  y: baseY + 48 + DEFAULT_NODES_SPACING,
                },
              };

              // Create an end node for this condition branch
              const endNode = {
                ...EMPTY_END_NODE,
                id: uuidv4(),
                position: {
                  x:
                    conditionNode.position.x +
                    CONDITION_NODE_WIDTH / 2 -
                    EMPTY_END_NODE.measured!.width / 2,
                  y:
                    baseY +
                    48 +
                    DEFAULT_NODES_SPACING * 2 +
                    48,
                },
              };

              newNodes.push(conditionNode, actionNode, endNode);

              // Create edges for this condition branch
              // Connect source node to condition node
              newEdges.push({
                id: `${nodeBeforeEnd.id}-${conditionNode.id}`,
                source: nodeBeforeEnd.id,
                target: conditionNode.id,
                sourceHandle: "output",
                targetHandle: "input",
              });

              // Connect condition node to action node
              newEdges.push({
                id: `${conditionNode.id}-${actionNode.id}`,
                source: conditionNode.id,
                target: actionNode.id,
                sourceHandle: "output",
                targetHandle: "input",
              });

              // Connect action node to end node
              newEdges.push({
                id: `${actionNode.id}-${endNode.id}`,
                source: actionNode.id,
                target: endNode.id,
                sourceHandle: "output",
                targetHandle: "input",
              });
            }

            // Remove the original end node and edge if they exist
            if (endNodeIndex >= 0) {
              updatedNodes.splice(endNodeIndex, 1);
            }
            if (endEdgeIndex >= 0) {
              updatedEdges.splice(endEdgeIndex, 1);
            }

            // Insert all new nodes
            if (endNodeIndex >= 0) {
              updatedNodes.splice(endNodeIndex, 0, ...newNodes);
            } else {
              // If no end node, just add the new nodes at the end
              updatedNodes.push(...newNodes);
            }

            return {
              nodes: updatedNodes,
              edges: [...updatedEdges, ...newEdges],
            };
          },
          false,
          "addEmptyConditionNodes"
        );
      },

      deleteNode: (nodeId) => {
        get().addToHistory("deleteNode", `Deleted node ${nodeId}`);
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => node.id !== nodeId),
            edges: state.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
            selectedNodeId:
              state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          }),
          false,
          "deleteNode"
        );
      },

      // Edge actions
      addEdge: (edge) => {
        get().addToHistory("addEdge", `Added edge from ${edge.source} to ${edge.target}`);
        set((state) => ({ edges: [...state.edges, edge] }), false, "addEdge");
      },

      updateEdge: (edgeId, updates) => {
        get().addToHistory("updateEdge", `Updated edge ${edgeId}`);
        set(
          (state) => ({
            edges: state.edges.map((edge) =>
              edge.id === edgeId ? { ...edge, ...updates } : edge
            ),
          }),
          false,
          "updateEdge"
        );
      },

      deleteEdge: (edgeId) => {
        get().addToHistory("deleteEdge", `Deleted edge ${edgeId}`);
        set(
          (state) => ({
            edges: state.edges.filter((edge) => edge.id !== edgeId),
            selectedEdgeId:
              state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
          }),
          false,
          "deleteEdge"
        );
      },

      // Selection actions
      selectNode: (nodeId) =>
        set(
          (state) => ({
            selectedNodeId: nodeId,
            selectedEdgeId: null,
            selectedNodeType: state.nodes.find((node) => node.id === nodeId)
              ?.type,
          }),
          false,
          "selectNode"
        ),

      selectEdge: (edgeId) =>
        set(
          { selectedEdgeId: edgeId, selectedNodeId: null },
          false,
          "selectEdge"
        ),

      clearSelection: () =>
        set(
          { selectedNodeId: null, selectedEdgeId: null },
          false,
          "clearSelection"
        ),

      // Layout actions
      setLayouting: (isLayouting) =>
        set({ isLayouting }, false, "setLayouting"),

      // Execution actions
      setExecutionProgress: (executionProgress) =>
        set({ executionProgress }, false, "setExecutionProgress"),

      addExecutionProgress: (progress) =>
        set(
          (state) => ({
            executionProgress: [...state.executionProgress, progress],
          }),
          false,
          "addExecutionProgress"
        ),

      setCurrentExecution: (currentExecution) =>
        set({ currentExecution }, false, "setCurrentExecution"),

      addExecutionToHistory: (execution) =>
        set(
          (state) => ({
            executionHistory: [...state.executionHistory, execution],
          }),
          false,
          "addExecutionToHistory"
        ),

      clearExecutionProgress: () =>
        set({ executionProgress: [] }, false, "clearExecutionProgress"),

      // History actions
      addToHistory: (action: string, description: string) => {
        const state = get();
        if (state.isUndoRedoAction) return; // Don't track undo/redo actions in state history
        
        const historyEntry: HistoryEntry = {
          id: uuidv4(),
          timestamp: Date.now(),
          action,
          description,
          state: {
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            edges: JSON.parse(JSON.stringify(state.edges)),
          },
        };
        
        // Add to both histories
        state.stateHistory.push(historyEntry);
        state.actionHistory.push(historyEntry);
      },

      undo: () => {
        const state = get();
        const currentEntry = state.stateHistory.getCurrent();
        const previousEntry = state.stateHistory.undo();
        if (previousEntry && currentEntry) {
          // First apply the state change
          set(
            {
              nodes: JSON.parse(JSON.stringify(previousEntry.state.nodes)),
              edges: JSON.parse(JSON.stringify(previousEntry.state.edges)),
              isUndoRedoAction: true,
            },
            false,
            "undo"
          );
          
          // Then add the undo action to action history only (not state history)
          setTimeout(() => {
            const undoEntry: HistoryEntry = {
              id: uuidv4(),
              timestamp: Date.now(),
              action: "undo",
              description: `Undid: ${currentEntry.description}`,
              state: {
                nodes: JSON.parse(JSON.stringify(previousEntry.state.nodes)),
                edges: JSON.parse(JSON.stringify(previousEntry.state.edges)),
              },
            };
            state.actionHistory.push(undoEntry);
            set({ isUndoRedoAction: false });
          }, 0);
        }
      },

      redo: () => {
        const state = get();
        const nextEntry = state.stateHistory.redo();
        if (nextEntry) {
          // First apply the state change
          set(
            {
              nodes: JSON.parse(JSON.stringify(nextEntry.state.nodes)),
              edges: JSON.parse(JSON.stringify(nextEntry.state.edges)),
              isUndoRedoAction: true,
            },
            false,
            "redo"
          );
          
          // Then add the redo action to action history only (not state history)
          setTimeout(() => {
            const redoEntry: HistoryEntry = {
              id: uuidv4(),
              timestamp: Date.now(),
              action: "redo",
              description: `Redid: ${nextEntry.description}`,
              state: {
                nodes: JSON.parse(JSON.stringify(nextEntry.state.nodes)),
                edges: JSON.parse(JSON.stringify(nextEntry.state.edges)),
              },
            };
            state.actionHistory.push(redoEntry);
            set({ isUndoRedoAction: false });
          }, 0);
        }
      },

      canUndo: () => get().stateHistory.canUndo(),
      canRedo: () => get().stateHistory.canRedo(),
      getHistory: () => get().actionHistory.getHistory(),

      resetWorkflow: () => {
        get().addToHistory("resetWorkflow", "Reset workflow");
        set(
          {
            nodes: [],
            edges: [],
            selectedNodeId: null,
            selectedEdgeId: null,
            executionProgress: [],
            currentExecution: null,
          },
          false,
          "resetWorkflow"
        );
      },

      loadWorkflow: (nodes, edges) => {
        get().addToHistory("loadWorkflow", "Load workflow");
        set(
          {
            nodes,
            edges,
            selectedNodeId: null,
            selectedEdgeId: null,
            executionProgress: [],
            currentExecution: null,
          },
          false,
          "loadWorkflow"
        );
      },
      };
    }),
    {
      name: "workflow-store",
    }
  )
);

// Selectors for computed values
export const useWorkflowSelectors = () => {
  const store = useWorkflowStore();

  return {
    // Get selected node
    selectedNode: store.selectedNodeId
      ? store.nodes.find((node) => node.id === store.selectedNodeId)
      : null,

    // Get selected edge
    selectedEdge: store.selectedEdgeId
      ? store.edges.find((edge) => edge.id === store.selectedEdgeId)
      : null,

    // Check if workflow is valid for execution
    isWorkflowValid:
      store.nodes.length > 0 &&
      store.nodes.some((node) => node.type === "start") &&
      store.nodes.some((node) => node.type === "end"),

    // Get execution status
    isExecuting:
      store.currentExecution?.status === "completed"
        ? false
        : !!store.currentExecution,

    // Get latest execution progress
    latestProgress:
      store.executionProgress.length > 0
        ? store.executionProgress[store.executionProgress.length - 1]
        : null,
  };
};
