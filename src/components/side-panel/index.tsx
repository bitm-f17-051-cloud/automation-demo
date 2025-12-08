"use client";

import { useWorkflowStore } from "@/store/workflow.store";
import { useVariableSelector } from "@/contexts/variable-selector-context";
import { useFilterTypeSelector } from "@/contexts/filter-type-selector-context";
import Triggers from "./triggers";
import Actions from "./actions";
import Intermediate from "./intermediate";
import Branch from "./branch";
import { VariableSelectorPanel } from "@/components/ui/variable-selector-panel";
import { FilterTypeSelectorPanel } from "@/components/ui/filter-type-selector-panel";

const SidePanel = () => {
  const { selectedNodeId, selectedNodeType, selectNode } = useWorkflowStore();
  const { isOpen: isVariablePanelOpen, closePanel: closeVariablePanel, handleSelect: handleVariableSelect } = useVariableSelector();
  const { isOpen: isFilterPanelOpen, closePanel: closeFilterPanel, handleSelect: handleFilterSelect } = useFilterTypeSelector();

  const closeSidePanel = () => {
    selectNode(null);
  };

  const isLeftPanelOpen = isVariablePanelOpen || isFilterPanelOpen;

  return (
    <div
      className={`h-full bg-white border-l border-gray-200 flex ${
        selectedNodeId ? "block" : "hidden"
      } ${isLeftPanelOpen ? "w-[60vw]" : "w-[30vw]"}`}
    >
      {isVariablePanelOpen && (
        <div className="w-[30vw] border-r border-gray-200">
          <VariableSelectorPanel
            isOpen={isVariablePanelOpen}
            onClose={closeVariablePanel}
            onSelect={handleVariableSelect}
          />
        </div>
      )}
      {isFilterPanelOpen && (
        <div className="w-[30vw] border-r border-gray-200">
          <FilterTypeSelectorPanel
            isOpen={isFilterPanelOpen}
            onClose={closeFilterPanel}
            onSelect={handleFilterSelect}
          />
        </div>
      )}
      <div className={`flex-1 flex flex-col ${isLeftPanelOpen ? "w-[30vw]" : "w-full"}`}>
        {selectedNodeType === "start" && <Triggers closeSidePanel={closeSidePanel} />}
        {selectedNodeType === "action" && <Actions closeSidePanel={closeSidePanel} />}
        {selectedNodeType === "intermediate" && <Intermediate closeSidePanel={closeSidePanel} />}
        {selectedNodeType === "condition" && <Branch closeSidePanel={closeSidePanel} />}
      </div>
    </div>
  );
};

export default SidePanel;
