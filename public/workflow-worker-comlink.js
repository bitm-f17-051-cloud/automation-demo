// Workflow Worker with Comlink - Browser compatible version
importScripts('https://unpkg.com/comlink@4.4.1/dist/umd/comlink.js');
importScripts('https://unpkg.com/dagre@0.8.5/dist/dagre.min.js');

class WorkflowWorkerAPI {
  constructor() {
    this.dagre = dagre;
    this.workflows = new Map();
    this.executionResults = new Map();
    this.progressCallback = null;
  }

  // Set progress callback for execution updates
  setProgressCallback(callback) {
    this.progressCallback = Comlink.proxy(callback);
  }

  // Layout computation using Dagre
  async computeLayout(nodes, edges, options = {}) {    
    const g = new this.dagre.graphlib.Graph();
    g.setGraph({ 
      rankdir: options.direction || 'TB',
      nodesep: 26,
      ranksep: 100,
      marginx: 0,
      marginy: 0
    });
    g.setDefaultEdgeLabel(() => ({}));

    const preserveX = options.preserveX || false;

    nodes.forEach(node => {
      const width = node.measured.width;
      const height = node.measured.height;
      g.setNode(node.id, { width, height });
    });

    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    this.dagre.layout(g);
    
    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = g.node(node.id);
      const newX = nodeWithPosition.x - node.measured.width / 2;
      const newY = nodeWithPosition.y - node.measured.height / 2;
      
      return {
        ...node,
        position: {
          x: preserveX ? node.position.x : newX,
          y: newY,
        },
      };
    });

    console.log("🚀 ~ WorkflowWorkerAPI ~ computeLayout ~ layoutedNodes:", layoutedNodes)
    console.log("🚀 ~ WorkflowWorkerAPI ~ computeLayout ~ edges:", edges)
    return { nodes: layoutedNodes, edges };
  }

  // Workflow execution engine
  async executeWorkflow(workflowId, nodes, edges, inputs = {}) {
    try {
      const executionId = `exec_${Date.now()}`;
      const executionPlan = this.buildExecutionPlan(nodes, edges);
      const results = new Map();
      
      // Store initial inputs
      Object.entries(inputs).forEach(([key, value]) => {
        results.set(key, value);
      });

      // Execute nodes in topological order
      for (const batch of executionPlan) {
        const batchPromises = batch.map(async (nodeId) => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node) return;

          try {
            const nodeInputs = this.getNodeInputs(node, edges, results);
            const output = await this.executeNode(node, nodeInputs);
            results.set(nodeId, output);
            
            // Send progress update
            if (this.progressCallback) {
              await this.progressCallback({
                executionId,
                nodeId,
                status: 'completed',
                output,
                progress: results.size / nodes.length
              });
            }
          } catch (error) {
            // Send error update
            if (this.progressCallback) {
              await this.progressCallback({
                executionId,
                nodeId,
                status: 'failed',
                error: error.message,
                progress: results.size / nodes.length
              });
            }
            throw error;
          }
        });

        await Promise.all(batchPromises);
      }

      const finalResults = Object.fromEntries(results);
      this.executionResults.set(executionId, finalResults);

      return {
        executionId,
        results: finalResults,
        status: 'completed'
      };
    } catch (error) {
      return {
        executionId: `exec_${Date.now()}`,
        error: error.message,
        status: 'failed'
      };
    }
  }

  buildExecutionPlan(nodes, edges) {
    // Build dependency graph
    const dependencies = new Map();
    const dependents = new Map();
    
    nodes.forEach(node => {
      dependencies.set(node.id, new Set());
      dependents.set(node.id, new Set());
    });

    edges.forEach(edge => {
      dependencies.get(edge.target).add(edge.source);
      dependents.get(edge.source).add(edge.target);
    });

    // Topological sort with batching
    const plan = [];
    const visited = new Set();
    const remaining = new Set(nodes.map(n => n.id));

    while (remaining.size > 0) {
      const batch = [];
      
      for (const nodeId of remaining) {
        const deps = dependencies.get(nodeId);
        const hasUnmetDeps = [...deps].some(dep => !visited.has(dep));
        
        if (!hasUnmetDeps) {
          batch.push(nodeId);
        }
      }

      if (batch.length === 0) {
        throw new Error('Circular dependency detected in workflow');
      }

      batch.forEach(nodeId => {
        visited.add(nodeId);
        remaining.delete(nodeId);
      });

      plan.push(batch);
    }

    return plan;
  }

  getNodeInputs(node, edges, results) {
    const inputs = {};
    const incomingEdges = edges.filter(edge => edge.target === node.id);
    
    incomingEdges.forEach(edge => {
      const sourceResult = results.get(edge.source);
      if (sourceResult !== undefined) {
        inputs[edge.sourceHandle || 'default'] = sourceResult;
      }
    });

    return inputs;
  }

  async executeNode(node, inputs) {
    // Simulate node execution based on type
    switch (node.type) {
      case 'start':
        return { message: 'Workflow started', timestamp: new Date().toISOString() };
      
      case 'condition':
        const condition = node.data?.condition || 'true';
        const result = this.evaluateCondition(condition, inputs);
        return { condition: result, inputs };
      
      case 'action':
        const action = node.data?.action || 'default';
        await this.simulateDelay(500); // Simulate work
        return { action, result: `Executed ${action}`, inputs };
      
      case 'transform':
        const transform = node.data?.transform || 'passthrough';
        return this.applyTransform(transform, inputs);
      
      case 'end':
        return { message: 'Workflow completed', inputs, timestamp: new Date().toISOString() };
      
      default:
        return { message: `Unknown node type: ${node.type}`, inputs };
    }
  }

  evaluateCondition(condition, inputs) {
    try {
      // Simple condition evaluation (in real app, use safer evaluation)
      const context = { inputs, ...inputs };
      return new Function('context', `with(context) { return ${condition}; }`)(context);
    } catch (error) {
      console.warn('Condition evaluation failed:', error);
      return false;
    }
  }

  applyTransform(transform, inputs) {
    switch (transform) {
      case 'uppercase':
        return Object.fromEntries(
          Object.entries(inputs).map(([key, value]) => [
            key, 
            typeof value === 'string' ? value.toUpperCase() : value
          ])
        );
      case 'lowercase':
        return Object.fromEntries(
          Object.entries(inputs).map(([key, value]) => [
            key, 
            typeof value === 'string' ? value.toLowerCase() : value
          ])
        );
      case 'count':
        return { count: Object.keys(inputs).length, inputs };
      default:
        return inputs;
    }
  }

  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validate workflow structure
  validateWorkflow(nodes, edges) {
    const errors = [];
    
    // Check for start node
    if (!nodes.some(node => node.type === 'start')) {
      errors.push('Workflow must have a start node');
    }
    
    // Check for end node
    if (!nodes.some(node => node.type === 'end')) {
      errors.push('Workflow must have an end node');
    }
    
    // Check for circular dependencies
    try {
      this.buildExecutionPlan(nodes, edges);
    } catch (error) {
      errors.push(error.message);
    }
    
    return { valid: errors.length === 0, errors };
  }
}

// Expose the API using Comlink
const workerAPI = new WorkflowWorkerAPI();
Comlink.expose(workerAPI);
