import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectWithFilterPanel } from "@/components/ui/select-with-filter-panel";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, GitBranch, GripVertical, Sparkles } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflow.store";

type IfElseActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

const COMPARISON_OPERATORS = [
  "exists",
  "does not exist",
  "is empty",
  "is not empty",
  "is equal to",
  "is not equal to",
  "contains",
  "does not contain",
  "starts with",
  "does not start with",
  "ends with",
  "does not end with"
] as const;

// Trigger Output Fields - Nested structure
const TRIGGER_OUTPUT_FIELDS = [
  // Root level
  { value: "id", label: "ID", category: "root" },
  { value: "direction", label: "direction", category: "root" },
  { value: "status", label: "status", category: "root" },
  { value: "started_at", label: "started_at", category: "root" },
  { value: "ended_at", label: "ended_at", category: "root" },
  { value: "duration", label: "duration", category: "root" },
  { value: "missed_call", label: "missed_call", category: "root" },
  { value: "recording_url", label: "recording_url", category: "root" },
  { value: "voicemail", label: "voicemail", category: "root" },
  
  // Users object
  { value: "users.id", label: "ID", category: "users" },
  { value: "users.name", label: "name", category: "users" },
  { value: "users.email", label: "email", category: "users" },
  
  // Contacts object
  { value: "contacts.id", label: "ID", category: "contacts" },
  { value: "contacts.name", label: "name", category: "contacts" },
  { value: "contacts.phone_number.value", label: "value", category: "contacts.phone_number" },
  { value: "contacts.number.id", label: "id", category: "contacts.number" },
  { value: "contacts.number.name", label: "name", category: "contacts.number" },
  { value: "contacts.number.digits", label: "digits", category: "contacts.number" },
  { value: "contacts.tags", label: "tags", category: "contacts" },
  { value: "contacts.notes", label: "notes", category: "contacts" },
  { value: "contacts.custom_fields", label: "custom_fields", category: "contacts" },
] as const;

type FilterType = typeof TRIGGER_OUTPUT_FIELDS[number]["value"] | "";

type FilterRow = {
  id: string;
  type: FilterType;
  textValue?: string;
  comparisonOperator?: typeof COMPARISON_OPERATORS[number];
  operator?: "AND" | "OR";
};

type Segment = {
  id: string;
  filters: FilterRow[];
};

type Branch = {
  id: string;
  type: "if" | "elseif" | "else";
  label: string;
  segments: Segment[];
};

const IfElseAction = ({ goBack, nodeData, selectedAction }: IfElseActionProps) => {
  // Reject if this is router data (not if/else)
  if (selectedAction === 'flow_router' || selectedAction === 'flow_router_path') {
    console.error("If/Else component received router action! This should not happen.");
    return <div className="p-6">Error: Router data opened in If/Else component. Please report this bug.</div>;
  }

  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const updateConditionNodeConfig = useWorkflowStore((state) => state.updateConditionNodeConfig);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  // If we're editing a branch node, find the parent intermediate node
  const getParentNodeData = () => {
    if (selectedAction === 'flow_if_else_branch') {
      // Find the parent intermediate node (the one that connects to this branch)
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          return parentNode.data;
        }
      }
    }
    return nodeData;
  };

  const effectiveNodeData = getParentNodeData();
  const [actionName, setActionName] = useState(effectiveNodeData?.label || effectiveNodeData?.config?.nodeName || "If/Else Condition");

  // Bootstrap branches from nodeData
  const bootstrapBranches = (): Branch[] => {
    const savedBranches = effectiveNodeData?.config?.branches || effectiveNodeData?.branches;
    if (savedBranches && Array.isArray(savedBranches) && savedBranches.length > 0) {
      return savedBranches;
    }
    return [
      { 
        id: "if-1", 
        type: "if", 
        label: "If",
        segments: [{ 
          id: "segment-1", 
          filters: [{ id: Math.random().toString(), type: "", comparisonOperator: "is equal to", operator: "AND" }] 
        }]
      },
      { 
        id: "else-1", 
        type: "else", 
        label: "Else",
        segments: []
      }
    ];
  };

  const [branches, setBranches] = useState<Branch[]>(() => {
    const initialBranches = bootstrapBranches();
    // Ensure segments exist for all branches
    return initialBranches.map(branch => ({
      ...branch,
      segments: branch.segments || []
    }));
  });

  const addElseIfBranch = () => {
    // Find the index of the last else branch
    const elseIndex = branches.findIndex(b => b.type === "else");
    const newBranch: Branch = {
      id: `elseif-${Date.now()}`,
      type: "elseif",
      label: "Else If",
      segments: [{ 
        id: `segment-${Date.now()}`, 
        filters: [{ id: Math.random().toString(), type: "", comparisonOperator: "is equal to", operator: "AND" }] 
      }]
    };
    
    if (elseIndex !== -1) {
      // Insert before the else branch
      const newBranches = [...branches];
      newBranches.splice(elseIndex, 0, newBranch);
      setBranches(newBranches);
    } else {
      // No else branch, just append
      setBranches([...branches, newBranch]);
    }
  };

  const removeBranch = (id: string) => {
    // Don't allow removing if it's the only if branch or the else branch
    const branch = branches.find(b => b.id === id);
    if (branch?.type === "if" || branch?.type === "else") return;
    
    setBranches(branches.filter(b => b.id !== id));
  };

  // Segment management
  const addSegment = (branchId: string) => {
    setBranches(branches.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          segments: [...b.segments, {
            id: `segment-${Date.now()}`,
            filters: [{ id: Math.random().toString(), type: "", comparisonOperator: "is equal to", operator: "AND" }]
          }]
        };
      }
      return b;
    }));
  };

  const removeSegment = (branchId: string, segmentId: string) => {
    setBranches(branches.map(b => {
      if (b.id === branchId && b.segments.length > 1) {
        return {
          ...b,
          segments: b.segments.filter(s => s.id !== segmentId)
        };
      }
      return b;
    }));
  };

  // Filter management within segments
  const addFilter = (branchId: string, segmentId: string) => {
    setBranches(branches.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          segments: b.segments.map(s => {
            if (s.id === segmentId) {
              return {
                ...s,
                filters: [...s.filters, { 
                  id: Math.random().toString(), 
                  type: "", 
                  comparisonOperator: "is equal to",
                  operator: "AND"
                }]
              };
            }
            return s;
          })
        };
      }
      return b;
    }));
  };

  const removeFilter = (branchId: string, segmentId: string, filterId: string) => {
    setBranches(branches.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          segments: b.segments.map(s => {
            if (s.id === segmentId && s.filters.length > 1) {
              return {
                ...s,
                filters: s.filters.filter(f => f.id !== filterId)
              };
            }
            return s;
          })
        };
      }
      return b;
    }));
  };

  const updateFilter = (branchId: string, segmentId: string, filterId: string, updates: Partial<FilterRow>) => {
    setBranches(branches.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          segments: b.segments.map(s => {
            if (s.id === segmentId) {
              return {
                ...s,
                filters: s.filters.map(f => f.id === filterId ? { ...f, ...updates } : f)
              };
            }
            return s;
          })
        };
      }
      return b;
    }));
  };

  const saveAction = () => {
    if (!selectedNodeId) return;

    // Determine the target node ID (parent intermediate node or current node)
    let targetNodeId = selectedNodeId;
    if (selectedAction === 'flow_if_else_branch') {
      // Find the parent intermediate node
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          targetNodeId = parentNode.id;
        }
      }
    }

    const properties = [];
    
    // Add branches to properties
    properties.push({ key: "branches", value: branches });

    // Create branch configs for each branch
    const branchConfigs = branches.map((branch) => ({
      nodeName: branch.label,
      nodeType: "flow_if_else_branch",
      nodeIcon: "flow_if_else",
      properties: [{ key: "segments", value: branch.segments }],
      branchType: branch.type,
      segments: branch.segments,
    }));

    const config = {
      nodeName: "If/Else", // This triggers the condition node creation
      nodeType: "flow_if_else",
      nodeIcon: "flow_if_else",
      properties: properties,
      branches: branches,
    };

    console.log("Saving If/Else config:", config);
    console.log("Branch configs:", branchConfigs);
    console.log("Target node ID:", targetNodeId);
    
    // Check if this is an edit by looking for existing condition nodes
    const existingConditionNodes = edges.filter(edge => edge.source === targetNodeId && nodes.find(n => n.id === edge.target && n.type === 'condition'));
    const isEdit = existingConditionNodes.length > 0;
    
    console.log("Is Edit?", isEdit, "Existing condition nodes:", existingConditionNodes.length);
    
    if (isEdit) {
      // Find branches that were removed
      const oldBranches = effectiveNodeData?.config?.branches || effectiveNodeData?.branches || [];
      const newBranchIds = branches.map(b => b.id);
      const branchesToDelete = oldBranches
        .filter((oldBranch: any) => !newBranchIds.includes(oldBranch.id))
        .map((branch: any) => branch.label);
      
      console.log("Branches to delete:", branchesToDelete);
      
      // Update the intermediate node config (without creating new nodes)
      updateNodeConfig(targetNodeId, config, false);
      
      // Use the dedicated update function for condition branches
      updateConditionNodeConfig(targetNodeId, branchConfigs, branchesToDelete);
    } else {
      // Create new branches
      updateNodeConfig(targetNodeId, config, true, branches.length, branchConfigs);
    }
    
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">If / Else</h2>
            <p className="text-sm text-gray-500">Create conditional if/else logic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Action Name</Label>
            <Input
              placeholder="Enter action name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Conditions */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-4 block uppercase text-xs tracking-wide">Conditions</Label>
            <div className="space-y-4">
              {branches.map((branch, branchIndex) => {
                // Ensure branch has segments array
                const safeBranch = {
                  ...branch,
                  segments: branch.segments || []
                };
                return (
                <div key={safeBranch.id} className="border border-gray-200 rounded-lg bg-white">
                  {/* Branch Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {safeBranch.type === "if" ? "If" : safeBranch.type === "elseif" ? "Else If" : "Else"}
                      </span>
                      {safeBranch.segments.length > 0 && safeBranch.type !== "else" && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                          {safeBranch.segments.reduce((sum, seg) => sum + (seg.filters || []).filter(f => f.type !== "").length, 0)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {safeBranch.type === "elseif" && (
                        <button
                          type="button"
                          onClick={() => removeBranch(safeBranch.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Branch Content */}
                  {safeBranch.type !== "else" ? (
                    <div className="p-4">
                      {/* Segments */}
                      <div className="space-y-6">
                        {safeBranch.segments.map((segment, segmentIndex) => {
                          // Ensure segment has filters array
                          const safeSegment = {
                            ...segment,
                            filters: segment.filters || []
                          };
                          return (
                          <div key={safeSegment.id}>
                            {/* Segment separator - show AND between segments */}
                            {segmentIndex > 0 && (
                              <div className="flex items-center justify-center -mt-3 mb-3">
                                <div className="flex items-center gap-2 bg-white px-4 py-1 border border-gray-300 rounded-full">
                                  <span className="text-xs font-semibold text-blue-600">AND</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Filters in Segment */}
                            <div className="space-y-3 relative">
                              {/* Delete Segment Button - only show if more than 1 segment */}
                              {safeBranch.segments.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSegment(safeBranch.id, safeSegment.id)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm z-10"
                                  title="Remove segment"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-600" />
                                </button>
                              )}
                              
                              {/* Filter Header */}
                              <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                  Filter Conditions
                                </label>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Advanced filters</span>
                                </div>
                              </div>
                              
                              {safeSegment.filters.map((filter, filterIndex) => (
                                <div key={filter.id} className="space-y-3">
                                  {/* AND/OR selector between filters WITHIN segment */}
                                  {filterIndex > 0 && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => updateFilter(safeBranch.id, safeSegment.id, filter.id, { operator: "AND" })}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                          filter.operator === "AND"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                      >
                                        AND
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateFilter(safeBranch.id, safeSegment.id, filter.id, { operator: "OR" })}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                          filter.operator === "OR"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                      >
                                        OR
                                      </button>
                                    </div>
                                  )}

                                  {/* Filter Row Card */}
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 space-y-3">
                                    {/* Field Selector */}
                                    <SelectWithFilterPanel
                                      value={filter.type}
                                      onValueChange={(val) => updateFilter(safeBranch.id, safeSegment.id, filter.id, {
                                        type: val as FilterType,
                                        textValue: "",
                                        comparisonOperator: "is equal to"
                                      })}
                                      placeholder="Select filter type"
                                      className="w-full bg-white border-gray-300"
                                    />

                                        {/* Comparison Operator */}
                                        {filter.type && (
                                      <Select
                                        value={filter.comparisonOperator || "is equal to"}
                                            onValueChange={(val) => updateFilter(safeBranch.id, safeSegment.id, filter.id, {
                                          comparisonOperator: val as typeof COMPARISON_OPERATORS[number]
                                        })}
                                      >
                                            <SelectTrigger className="w-full bg-white border-gray-300">
                                              <SelectValue placeholder="Select operator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {COMPARISON_OPERATORS.map((op) => (
                                                <SelectItem key={op} value={op}>{op}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}

                                        {/* Filter Value Input */}
                                    {filter.type && 
                                     filter.comparisonOperator !== "is empty" && 
                                     filter.comparisonOperator !== "is not empty" && 
                                     filter.comparisonOperator !== "exists" && 
                                     filter.comparisonOperator !== "does not exist" && (
                                      <Input
                                            type="text"
                                        placeholder={
                                          filter.comparisonOperator?.includes("comma separated")
                                            ? "Enter values separated by commas"
                                            : "Enter value"
                                        }
                                        value={filter.textValue || ""}
                                            onChange={(e) => updateFilter(safeBranch.id, safeSegment.id, filter.id, { textValue: e.target.value })}
                                            className="w-full"
                                      />
                                    )}
                                      </div>

                                    {/* Delete Filter Button */}
                                      {safeSegment.filters.length > 1 && (
                                      <button
                                        type="button"
                                          onClick={() => removeFilter(safeBranch.id, safeSegment.id, filter.id)}
                                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add Filter Button */}
                              <button
                                type="button"
                                onClick={() => addFilter(safeBranch.id, safeSegment.id)}
                                className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Another Filter
                              </button>
                            </div>
                          </div>
                          );
                        })}

                        {/* Add Segment Button */}
                        <button
                          type="button"
                          onClick={() => addSegment(safeBranch.id)}
                          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Segment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">When no condition is met</p>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}

              {/* Add Else If Button */}
              <button
                type="button"
                onClick={addElseIfBranch}
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Else If
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button onClick={saveAction} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
};

export default IfElseAction;

