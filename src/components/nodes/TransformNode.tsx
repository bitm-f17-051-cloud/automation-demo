// Transform node component
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { WorkflowNode } from '@/lib/worker-types';

export const TransformNode: React.FC<NodeProps> = (props) => {
  
  const data: WorkflowNode['data'] = props.data as WorkflowNode['data']
  const transform = data.transform

  return (
    <BaseNode
      {...props}
      title="Transform"
      icon={<RefreshCw className="w-4 h-4" />}
      className="border-purple-300 bg-purple-50"
      showHandles={{ top: true, right: false, bottom: true, left: false }}
    >
      <p className="font-mono text-xs">{transform}</p>
    </BaseNode>
  );
};
