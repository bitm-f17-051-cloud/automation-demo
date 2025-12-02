// Export all node types
export { BaseNode } from './BaseNode';
export { StartNode } from './StartNode';
export { ActionNode } from './ActionNode';
export { ConditionNode } from './ConditionNode';
export { TransformNode } from './TransformNode';
export { EndNode } from './EndNode';
export { AddTriggerNode } from './AddTriggerNode';

// Import for node types object
import { StartNode } from './StartNode';
import { ActionNode } from './ActionNode';
import { ConditionNode } from './ConditionNode';
import { IntermediateNode } from './IntermediateNode';
import { TransformNode } from './TransformNode';
import { EndNode } from './EndNode';
import { AddTriggerNode } from './AddTriggerNode';

// Node type definitions for React Flow
export const nodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
  intermediate: IntermediateNode,
  transform: TransformNode,
  end: EndNode,
  addTrigger: AddTriggerNode,
};
