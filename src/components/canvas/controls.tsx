"use client";

import React from "react";
import { useReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflow.store";
import { useWorkflowWorker } from "@/hooks/useWorkflowWorker";

interface CanvasControlsProps {
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ className }) => {
  const reactFlowInstance = useReactFlow();
  const { nodes, edges, canUndo, canRedo, undo, redo, setNodes, setEdges, setLayouting } = useWorkflowStore();
  const { isReady, computeLayout } = useWorkflowWorker();

  const onZoomIn = () => {
    reactFlowInstance.zoomIn();
  };

  const onZoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const onFixLayout = React.useCallback(async () => {
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

  return (
    <div className={`absolute bottom-4 left-4 z-10 flex items-center gap-2 ${className || ""}`}>
      {/* Zoom Controls Group */}
      <div className="bg-gray-100 rounded-lg p-1 flex items-center gap-1">
        <button
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors"
          onClick={onZoomOut}
          title="Zoom out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M8 11h6"/>
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors"
          onClick={onZoomIn}
          title="Zoom in"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M11 8v6M8 11h6"/>
          </svg>
        </button>
      </div>

      {/* Fullscreen & Document Group */}
      <div className="bg-gray-100 rounded-lg p-1 flex items-center gap-1">
        <button
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors"
          onClick={() => reactFlowInstance.fitView({ padding: 0.2, minZoom: 0.1, maxZoom: 1.5 })}
          title="Fit to screen"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors"
          onClick={onFixLayout}
          title="Fix layout"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
        </button>
        <button
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors"
          onClick={() => {}}
          title="Document"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        </button>
      </div>

      {/* Undo/Redo Group */}
      <div className="bg-gray-100 rounded-lg p-1 flex items-center gap-1">
        <button
          className={`w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors ${
            !canUndo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={undo}
          disabled={!canUndo()}
          title="Undo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6"/>
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
        </button>
        <button
          className={`w-8 h-8 rounded flex items-center justify-center hover:bg-white transition-colors ${
            !canRedo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={redo}
          disabled={!canRedo()}
          title="Redo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6"/>
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

