// End node component
import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export const EndNode: React.FC<NodeProps> = (props) => {
  // End nodes are now hidden - we use plus buttons instead
  return (
    <BaseNode
      {...props}
      title="End"
      className='opacity-0 pointer-events-none min-w-[1px] min-h-[1px] max-w-[1px] max-h-[1px] p-0'
      showHandles={{ top: false, right: false, bottom: false, left: false }}
    >
      <span className='hidden'></span>
    </BaseNode>
  );
};
