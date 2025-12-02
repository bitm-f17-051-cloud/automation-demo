/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConditionIcon } from "@/components/assets/icons/actions";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { getActionByValue } from "@/utils/side-panel/actions/actions.constants";
import { ActionsEnum } from "@/utils/side-panel/actions/actions.enum";
import { CheckIcon, PencilIcon, PlusIcon, Trash2, Wrench, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type ConditionalBranchingActionProps = {
  nodeData: { [key: string]: any; } | undefined;
  goBack: () => void;
};

const ConditionalBranchingAction = ({ nodeData, goBack }: ConditionalBranchingActionProps) => {
  const selectedActionData = getActionByValue(ActionsEnum.CONDITIONAL_BRANCHING);
  const IconComponent = selectedActionData?.icon;

  const { selectedNodeId, updateNodeConfig, updateConditionNodeConfig } = useWorkflowStore();

  const [branches, setBranches] = useState<string[]>(['Branch 1', 'Branch 2']);
  const [isBranchEditing, setIsBranchEditing] = useState<boolean>(false);
  const [branchIndex, setBranchIndex] = useState<number>(-1);
  const [branchValue, setBranchValue] = useState<string>("");
  const [branchesToDelete, setBranchesToDelete] = useState<string[]>([]);

  const [isSavedDisabled, setIsSavedDisabled] = useState(true);

  useEffect(() => {
    if (branches.length > 0) {
      setIsSavedDisabled(false);
    } else {
      setIsSavedDisabled(true);
    }
  }, [branches])

  // Setting the values from the node data
  useEffect(() => {
    if (selectedNodeId && nodeData && Array.isArray(nodeData)) {
      // setDescription(nodeData?.nodeDescription || "");
      setBranches(nodeData?.map((branch: any) => branch.nodeName) || []);
    }
  }, [selectedNodeId, nodeData])
  
  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: selectedActionData?.value,
      nodeName: selectedActionData?.label,
      nodeIcon: selectedActionData?.icon.name,
      nodeDescription: null
    }

    const branchConfigs = branches.map((branch) => ({
      nodeType: selectedActionData?.value,
      nodeName: branch,
      nodeIcon: selectedActionData?.icon.name,
      nodeDescription: null,
    }));

    if (nodeData) {
      updateConditionNodeConfig(selectedNodeId, branchConfigs, branchesToDelete);
    } else {
      updateNodeConfig(selectedNodeId, config, true, branches.length, branchConfigs);
    }
    goBack();
  };

  const handleAddBranch = () => {
    const branchesLength = branches.length;
    setBranches([...branches, `Branch ${branchesLength + 1}`]);
  };

  const handleEditBranch = (index: number) => {
    setBranchValue(branches[index]);
    setIsBranchEditing(true);
    setBranchIndex(index);
  };

  const handleSaveBranch = (index: number, value: string) => {
    setIsBranchEditing(false);
    setBranchIndex(-1);
    setBranches(branches.map((branch, i) => i === index ? value : branch));
  };

  const handleRemoveBranch = (index: number) => {
    setBranchesToDelete([...branchesToDelete, branches[index]]);
    setBranches(branches.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col px-4">
      {/* Header */}
      <div className="py-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {IconComponent && <IconComponent className="w-8 h-8" />}
              <h3>{selectedActionData?.label}</h3>
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
      </div>

      <Separator className="px-4" />

      {/* Details */}
      <div className="flex flex-col gap-4 py-4">

        {branches.map((branch, index) => (
          <div key={index} className="flex items-center justify-between border border-gray-200 rounded-[8px] p-3">
            <div className="flex items-center gap-2">
              <ConditionIcon className="!size-6" />
              {branchIndex !== index && <span className="text-sm font-medium text-gray-900">{branch}</span>}
              {isBranchEditing && branchIndex === index && 
                <div className="flex items-center gap-2">
                  <Input value={branchValue} onChange={(e) => setBranchValue(e.target.value)} className="px-2 py-1 h-7" />
                  <PrimaryButton onClick={() => handleSaveBranch(index, branchValue)} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !rounded-md !p-1 !text-white !bg-green-700 !text-sm !font-medium">
                    <CheckIcon className="!size-4" />
                  </PrimaryButton>
                  <PrimaryButton onClick={() => { setIsBranchEditing(false); setBranchIndex(-1); }} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !rounded-md !p-1 !text-white !bg-red-700 !text-sm !font-medium">
                    <XIcon className="!size-4" />
                  </PrimaryButton>
                </div>
              }
              {branchIndex !== index && <PrimaryButton onClick={() => handleEditBranch(index)} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !p-0 !text-gray-500 !text-sm !font-medium">
                <PencilIcon className="!size-4" />
              </PrimaryButton>}
            </div>
            {!isBranchEditing && <div className="flex items-center gap-2">
              <PrimaryButton onClick={() => handleEditBranch(index)} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !p-0 !text-gray-500 !text-sm !font-medium">
                <Wrench className="!size-4" />
              </PrimaryButton>
              <PrimaryButton onClick={() => handleRemoveBranch(index)} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !p-0 !text-gray-500 !text-sm !font-medium">
                <Trash2 className="!size-4" />
              </PrimaryButton>
            </div>}
          </div>
        ))}


        <PrimaryButton onClick={handleAddBranch} isPrimary={false} className="flex items-center gap-1.5 w-fit border-none !px-0 !text-blue-600 !text-sm !font-medium">
          <PlusIcon className="w-4 h-4" />
          Add Branch
        </PrimaryButton>
      </div>
      
      <div className="absolute bottom-0 right-0 w-[30vw] border-t border-gray-200 flex">
        <PrimaryButton disabled={isSavedDisabled} onClick={saveAction} isPrimary={true} className="w-fit my-3 ml-auto mr-3">Save</PrimaryButton>
      </div>

    </div>
  );
};

export default ConditionalBranchingAction;