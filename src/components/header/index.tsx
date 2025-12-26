"use client";

import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const Header = () => {
  const [workflowName, setWorkflowName] = useState("Workflow 1");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("Workflow 1");
  const [activeTab, setActiveTab] = useState<"builder" | "executions" | "published">("builder");
  const [isDraft, setIsDraft] = useState(true);

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 h-[52px]">
        {/* Left: Back button + Tabs */}
        <div className="flex items-center gap-3 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back to workflows list</p>
            </TooltipContent>
          </Tooltip>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("builder")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    activeTab === "builder"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                  Builder
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Build and design your workflow</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("executions")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    activeTab === "executions"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Execution logs
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View workflow execution history and logs</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors relative border-b-2 ${
                    activeTab === "published"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Published version
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View the published version of your workflow</p>
              </TooltipContent>
            </Tooltip>
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
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Edit workflow name"
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
              className="h-8 px-2 bg-transparent border border-gray-300 rounded text-base font-semibold text-gray-900 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Workflow name"
              aria-label="Edit workflow name"
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
          {/* Draft toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Draft</span>
                <button
                  onClick={() => setIsDraft((v) => !v)}
                  className={`w-11 h-6 rounded-full border relative transition-colors ${
                    isDraft ? "bg-gray-200 border-gray-300" : "bg-blue-600 border-blue-600"
                  }`}
                  aria-label="Toggle draft mode"
                  aria-pressed={isDraft}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transform transition-transform ${
                      isDraft ? "translate-x-0" : "translate-x-[20px]"
                    }`}
                  />
                </button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDraft ? "Workflow is in draft mode" : "Workflow is published"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Execute workflow button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Execute workflow
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Execute workflow</p>
            </TooltipContent>
          </Tooltip>

          {/* History/Clock icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.33203V7.9987L9.33333 9.33203" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.03345 7.33338C2.18284 5.86675 2.86696 4.50645 3.95527 3.51202C5.04358 2.51759 6.45991 1.95864 7.93403 1.9418C9.40815 1.92496 10.8369 2.45142 11.9476 3.42074C13.0584 4.39005 13.7734 5.73436 13.9562 7.1972C14.1391 8.66003 13.777 10.139 12.939 11.3519C12.1011 12.5648 10.8459 13.4267 9.41297 13.7733C7.98006 14.1198 6.46972 13.9267 5.17011 13.2308C3.8705 12.5348 2.87259 11.3848 2.36678 10M2.03345 13.3334V10H5.36678" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Version history</p>
            </TooltipContent>
          </Tooltip>

          {/* Publish button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition-colors whitespace-nowrap">
                Publish
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Publish workflow</p>
            </TooltipContent>
          </Tooltip>
        </div>
    </header>
    </TooltipProvider>
  );
};

export default Header;
