// Base node component with common functionality
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface BaseNodeProps {
  id: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  selected?: boolean;
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  showHandles?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  ref,
  selected,
  children,
  className,
  showHandles = { top: true, right: false, bottom: true, left: false }
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white border rounded-lg min-w-[312px] min-h-[48px]',
        'hover:shadow-sm transition-all duration-200',
        selected 
          ? 'border-blue-400 shadow-sm' 
          : 'border-gray-300 hover:border-gray-400',
        className
      )}
    >
      {/* Handles */}
      {showHandles.top && (
        <Handle
          type="target"
          position={Position.Top}
          id="input"
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
        />
      )}
      {showHandles.bottom && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="w-3 h-3 !bg-emerald-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
        />
      )}
      {showHandles.left && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-left"
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
        />
      )}
      {showHandles.right && (
        <Handle
          type="source"
          position={Position.Right}
          id="output-right"
          className="w-3 h-3 !bg-emerald-500 !border-2 !border-white !shadow-md hover:!scale-125 transition-transform"
        />
      )}

      {children}
    </div>
  );
};
