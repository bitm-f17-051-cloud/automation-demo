"use client";

import React, { useState } from "react";

interface ExecutionLogsProps {
  executions: Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>;
  testExecutions?: Array<{ id: number; workflow: string; status: "Success" | "Error"; started: string; runtime: string }>;
  className?: string;
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ 
  executions, 
  testExecutions = [],
  className 
}) => {
  const [showTestExecutions, setShowTestExecutions] = useState(false);

  return (
    <>
      {/* Main Executions Table */}
      <div className={`absolute top-14 left-4 right-4 bottom-4 z-20 bg-white border rounded-lg shadow-sm overflow-hidden ${className || ""}`}>
        <div className="h-full w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600 border-b">
                <th className="px-4 py-3 font-medium">Workflow</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Started</th>
                <th className="px-4 py-3 font-medium">Run Time</th>
                <th className="px-4 py-3 font-medium">Exec. ID</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((row) => {
                const isError = row.status === "Error";
                return (
                  <tr key={row.id} className={`border-b last:border-b-0 ${isError ? "bg-red-50/70" : ""}`}>
                    <td className="px-4 py-3 text-gray-900">{row.workflow}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            isError ? "bg-red-500" : "bg-green-500"
                          }`}
                        />
                        <span className={`${isError ? "text-red-700" : "text-green-700"}`}>{row.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{row.started}</td>
                    <td className="px-4 py-3 text-gray-800">{row.runtime}</td>
                    <td className="px-4 py-3 text-gray-800">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-gray-600">
                        <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="Details">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M10 3v4L5 17a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-10V3zM9 7h6" />
                          </svg>
                        </button>
                        <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="More">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="6" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="18" r="1.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Executions Modal */}
      {showTestExecutions && (
        <div className="absolute top-14 left-4 right-4 bottom-4 z-30 bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="h-full w-full overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <div className="text-sm font-medium text-gray-800">Test Executions</div>
              <button
                className="px-2 h-8 rounded-md border bg-white text-sm"
                onClick={() => setShowTestExecutions(false)}
                title="Close"
              >
                Close
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-4 py-3 font-medium">Workflow</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium">Run Time</th>
                  <th className="px-4 py-3 font-medium">Exec. ID</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testExecutions.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                      No test executions yet
                    </td>
                  </tr>
                )}
                {testExecutions.map((row) => {
                  const isError = row.status === "Error";
                  return (
                    <tr key={row.id} className={`border-b last:border-b-0 ${isError ? "bg-red-50/70" : ""}`}>
                      <td className="px-4 py-3 text-gray-900">{row.workflow}</td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              isError ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          <span className={`${isError ? "text-red-700" : "text-green-700"}`}>{row.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{row.started}</td>
                      <td className="px-4 py-3 text-gray-800">{row.runtime}</td>
                      <td className="px-4 py-3 text-gray-800">{row.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3 text-gray-600">
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="Details">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M10 3v4L5 17a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-10V3zM9 7h6" />
                            </svg>
                          </button>
                          <button className="w-7 h-7 rounded-md border bg-white grid place-items-center" title="More">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <circle cx="12" cy="6" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="18" r="1.5" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

