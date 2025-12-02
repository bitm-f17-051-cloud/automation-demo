// TypeScript interfaces for Web Worker communication
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface WorkflowNode {
  id: string;
  type: 'start' | 'condition' | 'action' | 'transform' | 'end' | 'custom' | 'intermediate';
  position: { x: number; y: number };
  data: {
    label: string;
    labelIcon?: string;
    config?: {
      [key: string]: any;
    }
    [key: string]: any;
  };
  measured?: { width: number; height: number };
  width?: number;
  height?: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
}

export interface LayoutOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  preserveX?: boolean; // If true, only update y-coordinates, preserve x-coordinates
}

export interface ExecutionProgress {
  executionId: string;
  nodeId: string;
  status: 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
  progress: number;
}

export interface ExecutionResult {
  executionId: string;
  results?: Record<string, any>;
  error?: string;
  status: 'completed' | 'failed';
}

export interface WorkerMessage {
  type: 'COMPUTE_LAYOUT' | 'EXECUTE_WORKFLOW' | 'VALIDATE_WORKFLOW' | 'WORKER_READY' | 'LAYOUT_COMPUTED' | 'WORKFLOW_EXECUTED' | 'EXECUTION_PROGRESS' | 'EXECUTION_ERROR' | 'ERROR';
  payload?: any;
}

export interface LayoutPayload {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  options?: LayoutOptions;
}

export interface ExecutionPayload {
  workflowId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  inputs?: Record<string, any>;
}
