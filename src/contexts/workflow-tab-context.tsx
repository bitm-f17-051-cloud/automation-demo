"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type WorkflowTab = "builder" | "executions" | "published";

interface WorkflowTabContextType {
  activeTab: WorkflowTab;
  setActiveTab: (tab: WorkflowTab) => void;
}

const WorkflowTabContext = createContext<WorkflowTabContextType | undefined>(undefined);

export const WorkflowTabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<WorkflowTab>("builder");

  return (
    <WorkflowTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </WorkflowTabContext.Provider>
  );
};

export const useWorkflowTab = () => {
  const context = useContext(WorkflowTabContext);
  if (!context) {
    throw new Error("useWorkflowTab must be used within WorkflowTabProvider");
  }
  return context;
};

