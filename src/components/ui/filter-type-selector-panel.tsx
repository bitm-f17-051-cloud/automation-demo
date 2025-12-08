import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/store/workflow.store";
import type { WorkflowNode } from "@/lib/worker-types";

// Helper function to get all previous nodes in the workflow (excluding filter nodes)
const getPreviousNodes = (currentNodeId: string | null, nodes: WorkflowNode[], edges: any[]): WorkflowNode[] => {
  if (!currentNodeId) return [];
  
  const previousNodes: WorkflowNode[] = [];
  const visited = new Set<string>();
  
  // Recursive function to traverse backwards through edges
  const traverseBackwards = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    // Find all edges that point to this node
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    
    for (const edge of incomingEdges) {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode) {
        // Skip filter nodes - they don't pass on data
        const isFilterNode = sourceNode.data?.config?.nodeType === 'flow_filter';
        
        if (!isFilterNode) {
          previousNodes.push(sourceNode);
        }
        
        // Continue traversing backwards (even through filter nodes to find nodes before them)
        traverseBackwards(sourceNode.id);
      }
    }
  };
  
  traverseBackwards(currentNodeId);
  
  // Remove duplicates and reverse to show most recent first
  const uniqueNodes = Array.from(
    new Map(previousNodes.map(node => [node.id, node])).values()
  );
  
  return uniqueNodes.reverse();
};

type FilterTypeSelectorPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export const FilterTypeSelectorPanel = ({
  isOpen,
  onClose,
  onSelect,
}: FilterTypeSelectorPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  // Get previous nodes
  const previousNodes = useMemo(() => {
    return getPreviousNodes(selectedNodeId, nodes, edges);
  }, [selectedNodeId, nodes, edges]);

  // Get trigger node (start node)
  const triggerNode = useMemo(() => {
    return nodes.find(n => n.type === 'start');
  }, [nodes]);

  if (!isOpen) return null;

  // Build fields from trigger output
  const triggerFields = useMemo(() => {
    const fields: Array<{ category: string; group: string; key: string; value: string; display: string }> = [];
    
    // Properties that are metadata/display-only and shouldn't be shown as output data
    const metadataKeys = [
      'Selection Type',
      'Channel',
      'Account',
      'Attachments',
      'Event Type',
      'Action Name',
      'Node Name',
      'Node Type',
      'Node Icon',
      'Node Description'
    ];
    
    // Get the node slug (nodeType) for the trigger node
    const nodeSlug = triggerNode?.data?.config?.nodeType || 'trigger';
    
    if (triggerNode?.data?.config?.properties) {
      triggerNode.data.config.properties.forEach((prop: any) => {
        // Skip if no key or value is empty/null/undefined
        if (!prop.key || prop.value === undefined || prop.value === null || prop.value === '') {
          return;
        }
        
        // Skip metadata/display properties
        if (metadataKeys.includes(prop.key)) {
          return;
        }
        
        // If the value is already a variable reference, use it directly
        // Otherwise, format it as {nodeSlug}.{formatted_key}
        let filterValue: string;
        if (typeof prop.value === 'string' && (prop.value.startsWith('trigger.') || prop.value.startsWith('node.'))) {
          filterValue = prop.value;
        } else {
          // Format the key: lowercase and replace spaces with underscores
          const formattedKey = prop.key.toLowerCase().replace(/\s+/g, '_');
          filterValue = `${nodeSlug}.${formattedKey}`;
        }
        
        fields.push({
          category: "Trigger Output",
          group: "Trigger",
          key: prop.key,
          value: filterValue,
          display: `Trigger: ${prop.key}`
        });
      });
    }
    
    // Add default trigger fields if no properties found
    if (fields.length === 0) {
      fields.push(
        { category: "Trigger Output", group: "Trigger", key: "Contact ID", value: `${nodeSlug}.contact_id`, display: "Trigger: Contact ID" },
        { category: "Trigger Output", group: "Trigger", key: "User ID", value: `${nodeSlug}.user_id`, display: "Trigger: User ID" },
        { category: "Trigger Output", group: "Trigger", key: "Email", value: `${nodeSlug}.email`, display: "Trigger: Email" },
      );
    }
    
    return fields;
  }, [triggerNode]);

  // Build fields from previous nodes
  const previousNodeFields = useMemo(() => {
    const fields: Array<{ category: string; group: string; key: string; value: string; display: string }> = [];
    
    // Properties that are metadata/display-only and shouldn't be shown as output data
    const metadataKeys = [
      'Selection Type',
      'Channel',
      'Account',
      'Attachments',
      'Event Type',
      'Action Name',
      'Node Name',
      'Node Type',
      'Node Icon',
      'Node Description'
    ];
    
    previousNodes.forEach((node) => {
      const nodeName = node.data?.config?.nodeName || `Node ${node.id.slice(0, 8)}`;
      const nodeId = node.id;
      
      if (node.data?.config?.properties) {
        node.data.config.properties.forEach((prop: any) => {
          // Skip if no key or value is empty/null/undefined
          if (!prop.key || prop.value === undefined || prop.value === null || prop.value === '') {
            return;
          }
          
          // Skip metadata/display properties
          if (metadataKeys.includes(prop.key)) {
            return;
          }
          
          // If the value is already a variable reference (starts with trigger. or node.), use it directly
          // Otherwise, format it as node.{nodeId}.{formatted_key}
          let filterValue: string;
          if (typeof prop.value === 'string' && (prop.value.startsWith('trigger.') || prop.value.startsWith('node.'))) {
            filterValue = prop.value;
          } else {
            // Format the key: lowercase and replace spaces with underscores
            const formattedKey = prop.key.toLowerCase().replace(/\s+/g, '_');
            filterValue = `node.${nodeId}.${formattedKey}`;
          }
          
          fields.push({
            category: "Previous Nodes",
            group: nodeName,
            key: prop.key,
            value: filterValue,
            display: `${nodeName}: ${prop.key}`
          });
        });
      }
    });
    
    return fields;
  }, [previousNodes]);

  const allFields = [...triggerFields, ...previousNodeFields];

  const filteredFields = allFields.filter((field) =>
    field.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFields = filteredFields.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = [];
    }
    acc[field.group].push(field);
    return acc;
  }, {} as Record<string, typeof allFields>);

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Select Filter Type</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-4">
          {Object.entries(groupedFields).map(([group, fields]) => {
            const isExpanded = expandedGroups.has(group);
            return (
              <div key={group}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className="w-full flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 hover:text-gray-700 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span>{group}</span>
                </button>
                {isExpanded && (
                  <div className="space-y-1">
                    {fields.map((field) => (
                      <button
                        key={field.value}
                        type="button"
                        onClick={() => onSelect(field.value)}
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <span className="font-medium">{field.key}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

