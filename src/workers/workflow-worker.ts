// // Workflow Worker with Comlink - Handles layout computation and workflow execution
// import * as Comlink from 'comlink';
// // Note: Dagre will be imported dynamically in the worker

// export interface WorkflowNode {
//   id: string;
//   type: 'start' | 'condition' | 'action' | 'transform' | 'end' | 'custom';
//   position: { x: number; y: number };
//   data: {
//     label: string;
//     condition?: string;
//     action?: string;
//     transform?: string;
//     [key: string]: any;
//   };
//   width?: number;
//   height?: number;
// }

// export interface WorkflowEdge {
//   id: string;
//   source: string;
//   target: string;
//   sourceHandle?: string;
//   targetHandle?: string;
//   type?: string;
// }

// export interface LayoutOptions {
//   direction?: 'TB' | 'BT' | 'LR' | 'RL';
//   nodeWidth?: number;
//   nodeHeight?: number;
// }

// export interface ExecutionResult {
//   executionId: string;
//   results?: Record<string, any>;
//   error?: string;
//   status: 'completed' | 'failed';
// }

// export interface ExecutionProgress {
//   executionId: string;
//   nodeId: string;
//   status: 'running' | 'completed' | 'failed';
//   output?: any;
//   error?: string;
//   progress: number;
// }

// class WorkflowWorkerAPI {
//   private dagre: any = null;
//   private workflows = new Map<string, any>();
//   private executionResults = new Map<string, any>();
  
//   // Progress callback for execution updates
//   private progressCallback?: (progress: ExecutionProgress) => void;

//   constructor() {
//     this.initializeDagre();
//   }

//   private async initializeDagre() {
//     try {
//       // Import Dagre dynamically
//       const dagreModule = await import('dagre');
//       this.dagre = dagreModule.default || dagreModule;
//     } catch (error) {
//       console.error('Failed to load Dagre:', error);
//     }
//   }

//   // Set progress callback for execution updates
//   setProgressCallback(callback: (progress: ExecutionProgress) => void) {
//     this.progressCallback = callback;
//   }

//   // Layout computation using Dagre
//   async computeLayout(
//     nodes: WorkflowNode[], 
//     edges: WorkflowEdge[]
//   ): Promise<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }> {
//     if (!this.dagre) {
//       throw new Error('Dagre not initialized');
//     }

//     const g = new this.dagre.graphlib.Graph();
//     g.setGraph({ 
//       rankdir: 'TB',
//       nodesep: 50,
//       ranksep: 100,
//       marginx: 20,
//       marginy: 20
//     });
//     g.setDefaultEdgeLabel(() => ({}));

//     // Add nodes to graph
//     nodes.forEach(node => {
//       console.log("🚀 ~ WorkflowWorkerAPI ~ computeLayout ~ node:", node)
//       g.setNode(node.id, { 
//         width: node.width, 
//         height: node.height,
//       });
//     });

//     // Add edges to graph
//     edges.forEach(edge => {
//       g.setEdge(edge.source, edge.target);
//     });

//     // Run layout
//     this.dagre.layout(g);

//     // Extract positioned nodes
//     const layoutedNodes = nodes.map(node => {
//       const nodeWithPosition = g.node(node.id);
//       return {
//         ...node,
//         position: {
//           x: nodeWithPosition.x - node.width! / 2,
//           y: nodeWithPosition.y - node.height! / 2,
//         },
//       };
//     });

//     return { nodes: layoutedNodes, edges };
//   }

//   // Workflow execution engine
//   async executeWorkflow(
//     workflowId: string, 
//     nodes: WorkflowNode[], 
//     edges: WorkflowEdge[], 
//     inputs: Record<string, any> = {}
//   ): Promise<ExecutionResult> {
//     try {
//       const executionId = `exec_${Date.now()}`;
//       const executionPlan = this.buildExecutionPlan(nodes, edges);
//       const results = new Map<string, any>();
      
//       // Store initial inputs
//       Object.entries(inputs).forEach(([key, value]) => {
//         results.set(key, value);
//       });

//       // Execute nodes in topological order
//       for (const batch of executionPlan) {
//         const batchPromises = batch.map(async (nodeId) => {
//           const node = nodes.find(n => n.id === nodeId);
//           if (!node) return;

//           try {
//             const nodeInputs = this.getNodeInputs(node, edges, results);
//             const output = await this.executeNode(node, nodeInputs);
//             results.set(nodeId, output);
            
//             // Send progress update
//             if (this.progressCallback) {
//               this.progressCallback({
//                 executionId,
//                 nodeId,
//                 status: 'completed',
//                 output,
//                 progress: results.size / nodes.length
//               });
//             }
//           } catch (error) {
//             // Send error update
//             if (this.progressCallback) {
//               this.progressCallback({
//                 executionId,
//                 nodeId,
//                 status: 'failed',
//                 error: error instanceof Error ? error.message : 'Unknown error',
//                 progress: results.size / nodes.length
//               });
//             }
//             throw error;
//           }
//         });

//         await Promise.all(batchPromises);
//       }

//       const finalResults = Object.fromEntries(results);
//       this.executionResults.set(executionId, finalResults);

//       return {
//         executionId,
//         results: finalResults,
//         status: 'completed'
//       };
//     } catch (error) {
//       return {
//         executionId: `exec_${Date.now()}`,
//         error: error instanceof Error ? error.message : 'Unknown error',
//         status: 'failed'
//       };
//     }
//   }

//   private buildExecutionPlan(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[][] {
//     // Build dependency graph
//     const dependencies = new Map<string, Set<string>>();
//     const dependents = new Map<string, Set<string>>();
    
//     nodes.forEach(node => {
//       dependencies.set(node.id, new Set());
//       dependents.set(node.id, new Set());
//     });

//     edges.forEach(edge => {
//       dependencies.get(edge.target)?.add(edge.source);
//       dependents.get(edge.source)?.add(edge.target);
//     });

//     // Topological sort with batching
//     const plan: string[][] = [];
//     const visited = new Set<string>();
//     const remaining = new Set(nodes.map(n => n.id));

//     while (remaining.size > 0) {
//       const batch: string[] = [];
      
//       for (const nodeId of remaining) {
//         const deps = dependencies.get(nodeId);
//         const hasUnmetDeps = deps ? [...deps].some(dep => !visited.has(dep)) : false;
        
//         if (!hasUnmetDeps) {
//           batch.push(nodeId);
//         }
//       }

//       if (batch.length === 0) {
//         throw new Error('Circular dependency detected in workflow');
//       }

//       batch.forEach(nodeId => {
//         visited.add(nodeId);
//         remaining.delete(nodeId);
//       });

//       plan.push(batch);
//     }

//     return plan;
//   }

//   private getNodeInputs(node: WorkflowNode, edges: WorkflowEdge[], results: Map<string, any>): Record<string, any> {
//     const inputs: Record<string, any> = {};
//     const incomingEdges = edges.filter(edge => edge.target === node.id);
    
//     incomingEdges.forEach(edge => {
//       const sourceResult = results.get(edge.source);
//       if (sourceResult !== undefined) {
//         inputs[edge.sourceHandle || 'default'] = sourceResult;
//       }
//     });

//     return inputs;
//   }

//   private async executeNode(node: WorkflowNode, inputs: Record<string, any>): Promise<any> {
//     // Simulate node execution based on type
//     switch (node.type) {
//       case 'start':
//         return { message: 'Workflow started', timestamp: new Date().toISOString() };
      
//       case 'condition':
//         const condition = node.data?.condition || 'true';
//         const result = this.evaluateCondition(condition, inputs);
//         return { condition: result, inputs };
      
//       case 'action':
//         const action = node.data?.action || 'default';
//         await this.simulateDelay(500); // Simulate work
//         return { action, result: `Executed ${action}`, inputs };
      
//       case 'transform':
//         const transform = node.data?.transform || 'passthrough';
//         return this.applyTransform(transform, inputs);
      
//       case 'end':
//         return { message: 'Workflow completed', inputs, timestamp: new Date().toISOString() };
      
//       default:
//         return { message: `Unknown node type: ${node.type}`, inputs };
//     }
//   }

//   private evaluateCondition(condition: string, inputs: Record<string, any>): boolean {
//     try {
//       // Simple condition evaluation (in real app, use safer evaluation)
//       const context = { inputs, ...inputs };
//       return new Function('context', `with(context) { return ${condition}; }`)(context);
//     } catch (error) {
//       console.warn('Condition evaluation failed:', error);
//       return false;
//     }
//   }

//   private applyTransform(transform: string, inputs: Record<string, any>): any {
//     switch (transform) {
//       case 'uppercase':
//         return Object.fromEntries(
//           Object.entries(inputs).map(([key, value]) => [
//             key, 
//             typeof value === 'string' ? value.toUpperCase() : value
//           ])
//         );
//       case 'lowercase':
//         return Object.fromEntries(
//           Object.entries(inputs).map(([key, value]) => [
//             key, 
//             typeof value === 'string' ? value.toLowerCase() : value
//           ])
//         );
//       case 'count':
//         return { count: Object.keys(inputs).length, inputs };
//       default:
//         return inputs;
//     }
//   }

//   private simulateDelay(ms: number): Promise<void> {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   // Validate workflow structure
//   validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[] } {
//     const errors: string[] = [];
    
//     // Check for start node
//     if (!nodes.some(node => node.type === 'start')) {
//       errors.push('Workflow must have a start node');
//     }
    
//     // Check for end node
//     if (!nodes.some(node => node.type === 'end')) {
//       errors.push('Workflow must have an end node');
//     }
    
//     // Check for circular dependencies
//     try {
//       this.buildExecutionPlan(nodes, edges);
//     } catch (error) {
//       errors.push(error instanceof Error ? error.message : 'Invalid workflow structure');
//     }
    
//     return { valid: errors.length === 0, errors };
//   }
// }

// // Export the API class for Comlink
// const workerAPI = new WorkflowWorkerAPI();
// Comlink.expose(workerAPI);
