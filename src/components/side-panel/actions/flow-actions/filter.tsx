/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflow.store";

type FilterActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

const FilterAction = ({ goBack, nodeData }: FilterActionProps) => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Filter");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeName: actionName,
      nodeType: "flow_filter",
      nodeIcon: "flow_filter",
      nodeDescription: "Filter workflow data",
      nodeData: {},
      properties: [],
    };

    updateNodeConfig(selectedNodeId, config, nodeData ? false : true);
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={goBack}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Filter</h2>
              <p className="text-xs text-gray-500">Filter workflow data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {/* Action Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Action Name</Label>
            <Input
              placeholder="Enter action name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <Button 
          onClick={saveAction} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Filter Action
        </Button>
      </div>
    </div>
  );
};

export default FilterAction;

