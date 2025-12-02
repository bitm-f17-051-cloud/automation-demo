// Hook for managing Web Worker communication with Comlink
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Comlink from 'comlink';
import type { 
  WorkflowNode, 
  WorkflowEdge, 
  ExecutionProgress,
  ExecutionResult 
} from '@/lib/worker-types';

// Worker API interface that matches the worker implementation
interface WorkflowWorkerAPI {
  computeLayout(nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  executeWorkflow(workflowId: string, nodes: WorkflowNode[], edges: WorkflowEdge[], inputs?: Record<string, any>): Promise<ExecutionResult>;
  setProgressCallback(callback: (progress: ExecutionProgress) => void): void;
  validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[] };
}

export const useWorkflowWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const workerAPIRef = useRef<Comlink.Remote<WorkflowWorkerAPI> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress[]>([]);

  // Initialize worker with Comlink
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create worker
      workerRef.current = new Worker('/workflow-worker-comlink.js');
      
      // Wrap with Comlink
      workerAPIRef.current = Comlink.wrap<WorkflowWorkerAPI>(workerRef.current);
      
      // Set up progress callback
      const progressCallback = (progress: ExecutionProgress) => {
        setExecutionProgress(prev => [...prev, progress]);
      };
      
      // Initialize the worker and set callback
      workerAPIRef.current.setProgressCallback(Comlink.proxy(progressCallback))
        .then(() => {
          setIsReady(true);
        })
        .catch((error) => {
          console.error('Failed to initialize worker:', error);
          setIsReady(false);
        });
      
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setIsReady(false);
      };
    }

    return () => {
      if (workerAPIRef.current) {
        workerAPIRef.current[Comlink.releaseProxy]();
      }
      workerRef.current?.terminate();
    };
  }, []);

  // Compute layout using Dagre
  const computeLayout = useCallback(
    async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> => {
      if (!workerAPIRef.current || !isReady) {
        throw new Error('Worker not ready');
      }

      return workerAPIRef.current.computeLayout(nodes, edges);
    },
    [isReady]
  );

  // Execute workflow
  const executeWorkflow = useCallback(
    async (workflowId: string, nodes: WorkflowNode[], edges: WorkflowEdge[], inputs?: Record<string, any>): Promise<ExecutionResult> => {
      if (!workerAPIRef.current || !isReady) {
        throw new Error('Worker not ready');
      }

      setIsExecuting(true);
      setExecutionProgress([]);

      try {
        const result = await workerAPIRef.current.executeWorkflow(workflowId, nodes, edges, inputs);
        setIsExecuting(false);
        return result;
      } catch (error) {
        setIsExecuting(false);
        throw error;
      }
    },
    [isReady]
  );

  // Validate workflow
  const validateWorkflow = useCallback(
    async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<{ valid: boolean; errors: string[] }> => {
      if (!workerAPIRef.current || !isReady) {
        return { valid: false, errors: ['Worker not ready'] };
      }

      return workerAPIRef.current.validateWorkflow(nodes, edges);
    },
    [isReady]
  );

  // Clear execution progress
  const clearExecutionProgress = useCallback(() => {
    setExecutionProgress([]);
  }, []);

  return {
    isReady,
    isExecuting,
    executionProgress,
    computeLayout,
    executeWorkflow,
    validateWorkflow,
    clearExecutionProgress
  };
};
