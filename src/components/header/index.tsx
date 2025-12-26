"use client";

import React, { useState } from "react";
import { useWorkflowTab } from "@/contexts/workflow-tab-context";

const Header = () => {
  const { activeTab, setActiveTab } = useWorkflowTab();
  const [workflowName, setWorkflowName] = useState("Workflow 1");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("Workflow 1");
  const [isDraft, setIsDraft] = useState(true);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-14">
      {/* Left: Back button + Tabs */}
      <div className="flex items-center gap-4 flex-1">
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-0">
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "builder" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
            </svg>
            <span>Builder</span>
            {activeTab === "builder" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("executions")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "executions" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Execution logs</span>
            {activeTab === "executions" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "published" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Published version</span>
            {activeTab === "published" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Center: Workflow name with edit icon */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {!editingName ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">
              {workflowName || "Workflow name"}
            </span>
            <button
              onClick={() => {
                setNameDraft(workflowName);
                setEditingName(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ) : (
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            className="h-8 px-2 bg-transparent border border-gray-300 rounded text-base font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Workflow name"
            autoFocus
            onBlur={() => {
              setWorkflowName(nameDraft.trim() || "Workflow name");
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setWorkflowName(nameDraft.trim() || "Workflow name");
                setEditingName(false);
              }
              if (e.key === "Escape") {
                setNameDraft(workflowName);
                setEditingName(false);
              }
            }}
          />
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        {/* Draft label and toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Draft</span>
          <button
            onClick={() => setIsDraft((v) => !v)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              isDraft ? "bg-gray-200" : "bg-blue-600"
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                isDraft ? "translate-x-0" : "translate-x-[20px]"
              }`}
            />
          </button>
        </div>

        {/* Execute workflow button */}
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Execute workflow</span>
        </button>

        {/* History icon */}
        <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Publish button */}
        <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Publish
        </button>
      </div>
    </header>
  );
};

export default Header;
