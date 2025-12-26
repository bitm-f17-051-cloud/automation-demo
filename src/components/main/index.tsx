"use client";

import { useWorkflowTab } from "@/contexts/workflow-tab-context";
import { WorkflowCanvas } from "../canvas";
import SidePanel from "../side-panel";

const Main = () => {
  const { activeTab } = useWorkflowTab();
  
  // Mock execution data - in a real app, this would come from an API or store
  const executions = [
    { id: 62, workflow: "My workflow", status: "Error" as const, started: "Starting soon", runtime: "-0.002s" },
    { id: 61, workflow: "My workflow", status: "Success" as const, started: "Nov 6, 14:54:56", runtime: "1.354s" },
    { id: 60, workflow: "My workflow", status: "Success" as const, started: "Nov 6, 14:39:23", runtime: "1.696s" },
    { id: 59, workflow: "My workflow", status: "Success" as const, started: "Nov 6, 14:37:21", runtime: "204ms" },
  ];

  const testExecutions = [
    { id: 5, workflow: "My workflow", status: "Success" as const, started: "Nov 7, 10:01:22", runtime: "418ms" },
    { id: 4, workflow: "My workflow", status: "Success" as const, started: "Nov 7, 09:59:03", runtime: "1.012s" },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      <WorkflowCanvas 
        activeTab={activeTab}
        executions={executions}
        testExecutions={testExecutions}
      />
      <SidePanel />
    </div>
  );
};

export default Main;