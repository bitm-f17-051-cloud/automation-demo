// Intermediate node component (If/Else parent node)
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { WorkflowNode } from '@/lib/worker-types';
import { GitBranch, Split, GitMerge } from 'lucide-react';

export const IntermediateNode: React.FC<NodeProps> = (props) => {
  const data: WorkflowNode["data"] = props.data as WorkflowNode["data"];
  const { config } = data;

  return (
    <BaseNode
      {...props}
      title="Intermediate"
      className={'!w-[312px] !h-[48px] p-0'}
      showHandles={{ top: true, right: false, bottom: true, left: false }}
    >
      <div className="px-3 h-full flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
            {config?.nodeType === "flow_merge" ? (
              <GitMerge className="w-5 h-5 text-blue-600" />
            ) : config?.nodeName === "Router" ? (
              <Split className="w-5 h-5 text-green-600" />
            ) : (
              <GitBranch className="w-5 h-5 text-purple-600" />
            )}
          </div>
          <div className="flex flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-900 truncate">
              {config?.nodeName || "If/Else"}
            </h3>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
