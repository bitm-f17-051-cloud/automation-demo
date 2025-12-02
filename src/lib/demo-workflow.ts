// Demo workflow data
import type { WorkflowNode, WorkflowEdge } from './worker-types';

export const demoNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { label: 'Start' },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 100, y: 250 },
    data: { 
      label: 'Process Data',
      action: 'processUserData'
    },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 100, y: 400 },
    data: { 
      label: 'Check Status',
      condition: 'inputs.value > 100'
    },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 300, y: 550 },
    data: { 
      label: 'Transform Data',
      transform: 'uppercase'
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: -100, y: 550 },
    data: { 
      label: 'Send Notification',
      action: 'sendEmail'
    },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 100, y: 700 },
    data: { label: 'End' },
  },
];

export const demoEdges: WorkflowEdge[] = [
  {
    id: 'edge-start-action',
    source: 'start-1',
    target: 'action-1',
    sourceHandle: null,
    targetHandle: null
  },
  {
    id: 'edge-action-condition',
    source: 'action-1',
    target: 'condition-1',
    sourceHandle: null,
    targetHandle: null
  },
  {
    id: 'edge-condition-transform',
    source: 'condition-1',
    target: 'transform-1',
    sourceHandle: null,
    targetHandle: null
  },
  {
    id: 'edge-condition-action2',
    source: 'condition-1',
    target: 'action-2',
    sourceHandle: null,
    targetHandle: null
  },
  {
    id: 'edge-transform-end',
    source: 'transform-1',
    target: 'end-1',
    sourceHandle: null,
    targetHandle: null
  },
  {
    id: 'edge-action2-end',
    source: 'action-2',
    target: 'end-1',
    sourceHandle: null,
    targetHandle: null
  },
];

export const demoWorkflow = {
  nodes: demoNodes,
  edges: demoEdges,
};
