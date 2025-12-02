/* eslint-disable @typescript-eslint/no-explicit-any */

import { WorkflowNode } from "@/lib/worker-types";

// Variable registry with string arrays for easy parsing
export const TRIGGER_VARIABLES = {
  contact_created: [
    'contact.id',
    'contact.firstName',
    'contact.lastName',
    'contact.email',
    'contact.phoneNumber',
    'contact.secondary_email',
    'contact.secondary_phoneNumber',
    'contact.createdAt',
    'contact.updatedAt',
    'contact.status',
    'contact.country',
    'contact.timeZone',
    'contact.previewId',
    'contact.ipAddress',
    'contact.user.id',
    'contact.user.email',
    'contact.user.firstName',
    'contact.user.lastName',
    'contact.user.profilePictureKey',
    'contact.user.signedUrl',
    'contact.Utm',
    'contact.CustomFieldAssociation',
    'contact.isNewRecord',
    'contact.actionStatus',
    'contact.initialStatus',
    'contact.statusUpdatedAt',
    'contact.lastInteractionStatus',
    'contact.lastInteractionType',
    'contact.totalCallsBooked',
    'contact.strategyCallsBooked',
    'contact.discoveryCallsBooked',
    'contact.setterOutcome',
    'contact.setterId',
    'contact.setterAssignDate',
    'contact.income',
    'contact.setter.id',
    'contact.setter.firstName',
    'contact.setter.lastName',
    'contact.setter.email',
    'contact.setter.profilePictureKey',
    'contact.setter.signedUrl',
    'contact.SetterClaim'
  ]
} as const;

// Utility function to parse data object into variable strings
export const parseDataToVariables = (
  data: Record<string, any>, 
  prefix: string = 'data'
): string[] => {
  const variables: string[] = [];
  
  const parseObject = (obj: any, currentPath: string) => {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = `${currentPath}.${key}`;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively parse nested objects
        parseObject(value, newPath);
      } else {
        // Add primitive values to variables array
        variables.push(newPath);
      }
    });
  };
  
  parseObject(data, prefix);
  return variables;
};

// Helper function to get variables for a specific trigger
export const getVariablesForTrigger = (triggerType: string): string[] => {
  return [...(TRIGGER_VARIABLES[triggerType as keyof typeof TRIGGER_VARIABLES] || [])];
};

// Get all available variables from workflow nodes
export const getAllAvailableVariables = (workflowNodes: WorkflowNode[]): Record<string, string[]> => {
  const availableVariables: Record<string, string[]> = {};
  
  workflowNodes.forEach((node) => {
    if (node.type === 'start' && node.data.config?.nodeType) {
      const variables = getVariablesForTrigger(node.data.config.nodeType);
      availableVariables[node.id] = variables;
    }
  });
  
  return availableVariables;
};

// Get variables for autocomplete (with node context)
export const getVariablesForAutocomplete = (workflowNodes: WorkflowNode[], currentNodeId: string): Array<{label: string, sourceNode: string}> => {
  const allVariables = getAllAvailableVariables(workflowNodes);
  const currentNodeIndex = workflowNodes.findIndex(n => n.id === currentNodeId);
  const autocompleteOptions: Array<{label: string, sourceNode: string}> = [];
  
  Object.entries(allVariables).forEach(([nodeId, variables]) => {
    const sourceNodeIndex = workflowNodes.findIndex(n => n.id === nodeId);
    const sourceNode = workflowNodes.find(n => n.id === nodeId);
    
    // Only include variables from previous nodes
    if (sourceNodeIndex < currentNodeIndex && sourceNode) {
      variables.forEach(variable => {
        autocompleteOptions.push({
          label: variable,
          sourceNode: (sourceNodeIndex + 1).toString()
        });
      });
    }
  });
  
  return autocompleteOptions;
};

// Parse variable reference (e.g., "nodeId.contact.firstName" -> {nodeId: "nodeId", path: "contact.firstName"})
export const parseVariableReference = (variableRef: string): {nodeId: string, path: string} | null => {
  const parts = variableRef.split('.');
  if (parts.length < 2) return null;
  
  const nodeId = parts[0];
  const path = parts.slice(1).join('.');
  
  return { nodeId, path };
};