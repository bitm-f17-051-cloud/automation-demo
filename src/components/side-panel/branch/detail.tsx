/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConditionIcon } from "@/components/assets/icons/actions";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { PlusIcon, Trash2, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Types for condition management
interface Condition {
  id: string;
  field: string;
  operator: string;
  value: number ;
}

interface ConditionOperator {
  condition1Id: string;
  operator: 'AND' | 'OR';
  condition2Id: string;
}

interface GroupOperator {
  group1Id: string;
  operator: 'AND' | 'OR';
  group2Id: string;
}

interface ConditionGroup {
  id: string;
  conditions: Condition[];
  conditionOperators: ConditionOperator[]; // Operators between conditions within this group
}

interface ConditionTree {
  groups: ConditionGroup[];
  groupOperators: GroupOperator[]; // Operators between condition groups
}

type BranchDetailProps = {
  nodeData: { [key: string]: any; } | undefined;
  goBack: () => void;
};

const BranchDetail = ({ nodeData, goBack }: BranchDetailProps) => {

  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [isSavedDisabled, setIsSavedDisabled] = useState(true);
  const [description, setDescription] = useState("");
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [conditionTree, setConditionTree] = useState<ConditionTree>({
    groups: [],
    groupOperators: []
  });

  // Load existing condition tree from nodeData.nodeData
  useEffect(() => {
    if (nodeData?.nodeData?.conditionTree) {
      setConditionTree(nodeData.nodeData.conditionTree);
    } else {
      setConditionTree({
        groups: [],
        groupOperators: []
      });
    }
    
    // Load description from existing nodeData
    if (nodeData?.nodeData?.nodeDescription) {
      setDescription(nodeData.nodeData.nodeDescription);
    } else {
      setDescription("");
    }
  }, [nodeData?.nodeData?.conditionTree, nodeData?.nodeData?.nodeDescription]);

  // Function to convert condition tree to human-readable text
  const conditionTreeToText = (tree: ConditionTree): string => {
    if (!tree.groups || tree.groups.length === 0) {
      return "";
    }

    const groupTexts: string[] = [];

    tree.groups.forEach((group, groupIndex) => {
      // Build text for conditions within this group
      const conditionTexts: string[] = [];
      
      group.conditions.forEach((condition, conditionIndex) => {
        const conditionText = `${condition.field} ${condition.operator} ${condition.value}`;
        conditionTexts.push(conditionText);
        
        // Add operator between conditions if it exists
        if (conditionIndex < group.conditions.length - 1) {
          const conditionOp = group.conditionOperators[conditionIndex];
          if (conditionOp) {
            conditionTexts.push(conditionOp.operator.toLowerCase());
          }
        }
      });
      
      // Join conditions with operators
      const groupText = conditionTexts.join(" ");
      
      // Add group operator if this is not the first group
      if (groupIndex > 0) {
        const groupOperator = tree.groupOperators.find(op => op.group2Id === group.id);
        if (groupOperator) {
          groupTexts.push(groupOperator.operator.toLowerCase());
        }
      }
      
      // Add parentheses around each group if there are multiple groups
      if (tree.groups.length > 1) {
        groupTexts.push(`(${groupText})`);
      } else {
        groupTexts.push(groupText);
      }
    });

    // Join all groups with their operators
    const result = groupTexts.join(" ");
    
    // Capitalize first letter and add "If" prefix
    return result ? `If ${result.charAt(0).toUpperCase() + result.slice(1)}` : "";
  };

  // Helper functions for condition management
  const addConditionGroup = () => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup: ConditionGroup = {
      id: newGroupId,
      conditions: [{
        id: `condition-${Date.now()}`,
        field: 'Deal / Value',
        operator: 'Is greater than',
        value: 0
      }],
      conditionOperators: []
    };
    
    setConditionTree(prev => {
      const newGroupOperators = prev.groups.length > 0 
        ? [...prev.groupOperators, {
            group1Id: prev.groups[prev.groups.length - 1].id,
            operator: 'AND' as 'AND' | 'OR',
            group2Id: newGroupId
          }]
        : prev.groupOperators;
        
      return {
        groups: [...prev.groups, newGroup],
        groupOperators: newGroupOperators
      };
    });
  };

  const addCondition = (groupId: string) => {
    setConditionTree(prev => ({
      ...prev,
      groups: prev.groups.map(group => 
        group.id === groupId 
          ? (() => {
              const newConditionId = `condition-${Date.now()}`;
              return {
                ...group,
                conditions: [...group.conditions, {
                  id: newConditionId,
                  field: 'Deal / Value',
                  operator: 'Is greater than',
                  value: 0
                }],
                conditionOperators: [...group.conditionOperators, {
                  condition1Id: group.conditions[group.conditions.length - 1].id,
                  operator: 'AND' as 'AND' | 'OR',
                  condition2Id: newConditionId
                }]
              };
            })()
          : group
      )
    }));
  };

  const updateCondition = (groupId: string, conditionId: string, field: string, value: string) => {
    setConditionTree(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map(condition =>
                condition.id === conditionId
                  ? { ...condition, [field]: value }
                  : condition
              )
            }
          : group
      )
    }));
  };

  const updateConditionOperator = (groupId: string, operatorIndex: number, operator: 'AND' | 'OR') => {
    setConditionTree(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditionOperators: group.conditionOperators.map((op, index) =>
                index === operatorIndex ? { ...op, operator } : op
              )
            }
          : group
      )
    }));
  };

  const updateGroupOperator = (groupId: string, operator: 'AND' | 'OR') => {
    setConditionTree(prev => ({
      ...prev,
      groupOperators: prev.groupOperators.map(groupOp =>
        groupOp.group2Id === groupId ? { ...groupOp, operator } : groupOp
      )
    }));
  };

  const deleteCondition = (groupId: string, conditionId: string) => {
    setConditionTree(prev => ({
      ...prev,
      groups: prev.groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter(condition => condition.id !== conditionId),
              conditionOperators: group.conditionOperators.filter((_, index) => {
                // Remove operator that was connecting the deleted condition
                const deletedConditionIndex = group.conditions.findIndex(c => c.id === conditionId);
                return index !== deletedConditionIndex - 1;
              })
            }
          : group
      )
    }));
  };

  const deleteConditionGroup = (groupId: string) => {
    setConditionTree(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id !== groupId),
      groupOperators: prev.groupOperators.filter(groupOp => 
        groupOp.group1Id !== groupId && groupOp.group2Id !== groupId
      )
    }));
  };
  
  const saveAction = () => {
    if (!selectedNodeId) return;
    
    // Generate human-readable text from condition tree
    const conditionText = conditionTreeToText(conditionTree);
    
    const config = {
      nodeType: nodeData?.nodeType,
      nodeName: nodeData?.nodeName,
      nodeIcon: nodeData?.nodeIcon,
      nodeDescription: description,
      nodeData: {
        conditionTree: conditionTree,
        conditionText: conditionText
      }
    }

    updateNodeConfig(selectedNodeId, config, false);
    goBack();
  };

  useEffect(() => {
    if (description && conditionTree.groups.length > 0) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [description, conditionTree.groups])

  return (
    <div className="flex flex-col px-4">
      {/* Header */}
      <div className="py-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ConditionIcon className="w-8 h-8" />
              <h3>{nodeData?.nodeName}</h3>
            </div>

            <div className="flex items-center gap-4">
              <PrimaryButton
                isPrimary={false}
                className="border-none cursor-pointer !p-0 !pr-2"
                onClick={goBack}
              >
                <XIcon className="w-4 h-4 text-gray-500" strokeWidth={3} />
              </PrimaryButton>
            </div>
          </div>
          {/* Description */}
          <div className="text-sm text-gray-500">Configure your action</div>
        </div>
        {/* Search */}
        <Input
          placeholder="Add a description for this node"
          className={`${
            !isDescriptionFocused ? "bg-gray-50" : "bg-white"
          } border-gray-200`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setIsDescriptionFocused(true)}
          onBlur={() => setIsDescriptionFocused(false)}
        />
      </div>

      <Separator className="px-4" />

      {/* Details */}
      <div className="">
        <div className="text-lg font-medium my-4">Set your conditions</div>
        
        {/* Condition Groups */}
        {conditionTree.groups.map((group, groupIndex) => (
          <div key={group.id} className="">
            {/* Group operator (only show if not the first group) */}
            {groupIndex > 0 && (
              <>
                <div className="h-4 w-[1px] border-l border-gray-200 mx-3" />
                <div className="flex justify-start">
                  <Select
                    value={conditionTree.groupOperators.find(op => op.group2Id === group.id)?.operator || 'AND'}
                    onValueChange={(value) => updateGroupOperator(group.id, value as 'AND' | 'OR')}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-4 w-[1px] border-l border-gray-200 mx-3" />
              </>
            )}
            
            {/* Condition Group */}
            <div className="flex items-start gap-1.5">
              <div className="grow bg-white border border-gray-200 rounded-[8px] p-3 flex flex-col gap-3">
                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="flex flex-col gap-3">
                    {/* Condition operator (only show if not the first condition in group) */}
                    {conditionIndex > 0 && (
                      <div className="flex justify-start">
                        <Select
                          value={group.conditionOperators[conditionIndex - 1]?.operator || 'AND'}
                          onValueChange={(value) => updateConditionOperator(group.id, conditionIndex - 1, value as 'AND' | 'OR')}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {/* Condition Row */}
                    <div className="flex items-start gap-1.5">
                      <div className="grow flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          {/* Field select */}
                          <Select
                            value={condition.field}
                            onValueChange={(value) => updateCondition(group.id, condition.id, 'field', value)}
                          >
                            <SelectTrigger className="grow">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Deal / Value">Deal / Value</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {/* Operator select */}
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(group.id, condition.id, 'operator', value)}
                          >
                            <SelectTrigger className="grow">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Is greater than">Is greater than</SelectItem>
                              <SelectItem value="Is less than">Is less than</SelectItem>
                              <SelectItem value="Is Equal to">Is Equal to</SelectItem>
                            </SelectContent>
                          </Select>
                          
                        </div>
                        {/* Value input */}
                        <div className="flex items-start gap-1.5 pl-3">
                          <svg width="15" height="22" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
                            <path d="M1 0V17C1 19.2091 2.79086 21 5 21H15" stroke="#D1D5DB"/>
                          </svg>

                          <Input
                            type="number"
                            value={condition.value}
                            onChange={(e) => updateCondition(group.id, condition.id, 'value', e.target.value)}
                            placeholder="5000"
                            className="w-full bg-gray-50 focus-within:!bg-white focus-within:!border-gray-300 focus-visible:!ring-0 "
                          />
                        </div>
                      </div>
                       {group.conditions.length > 1 && (
                         <Trash2 
                           className="!size-4 text-gray-500 mt-2.5 cursor-pointer hover:text-red-500" 
                           onClick={() => deleteCondition(group.id, condition.id)}
                         />
                       )}
                    </div>
                  </div>
                ))}
                
                {/* Add condition button */}
                <PrimaryButton onClick={() => addCondition(group.id)} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !p-0 !text-blue-600 !text-sm !font-medium">
                  <PlusIcon className="w-4 h-4" />
                  Add Condition
                </PrimaryButton>
              </div>
               {conditionTree.groups.length > 1 && (
                 <Trash2 
                   className="!size-4 text-gray-500 mt-2.5 cursor-pointer hover:text-red-500" 
                   onClick={() => deleteConditionGroup(group.id)}
                 />
               )}
            </div>
          </div>
        ))}
        
        {/* Add condition group button */}
        <PrimaryButton
          onClick={addConditionGroup}
          isPrimary={false} className="mt-4 flex items-center gap-1.5 w-fit border-none !p-0 !text-blue-600 !text-sm !font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Add condition group
        </PrimaryButton>
      </div>
      
      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton disabled={isSavedDisabled} onClick={saveAction} isPrimary={true} className="w-fit my-3 ml-auto mr-3">Save</PrimaryButton>
      </div>

    </div>
  );
};

export default BranchDetail;