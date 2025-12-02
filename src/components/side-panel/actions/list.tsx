import { Input } from "@/components/ui/input";
import { Grid3x3, Search as SearchIcon, XIcon, Phone, User, Workflow, MessageSquare } from "lucide-react";
import {
  getActionsGroupedByCategory,
} from "@/utils/side-panel/actions/actions.constants";
import { useMemo, useState } from "react";

type ActionsListProps = {
  setSelectedAction: (action: string) => void;
  closeSidePanel: () => void;
};

const ActionsList = ({ closeSidePanel, setSelectedAction }: ActionsListProps) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "flow" | "call" | "contact" | "searches" | "communication">("all");
  const actionsGroupedByCategory = getActionsGroupedByCategory();

  // Filter actions based on query and active tab
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    let groups = actionsGroupedByCategory;

    // Filter by tab
    if (activeTab === "call") {
      groups = { "CALL": actionsGroupedByCategory["CALL"] || [] };
    } else if (activeTab === "contact") {
      groups = { "CONTACT": actionsGroupedByCategory["CONTACT"] || [] };
    } else if (activeTab === "searches") {
      groups = { "SEARCHES": actionsGroupedByCategory["SEARCHES"] || [] };
    } else if (activeTab === "flow") {
      groups = { "FLOW": actionsGroupedByCategory["FLOW"] || [] };
    } else if (activeTab === "communication") {
      groups = { "COMMUNICATION": actionsGroupedByCategory["COMMUNICATION"] || [] };
    }

    // Filter by search query
    if (!q) return groups;
    return Object.entries(groups).reduce(
      (acc, [category, actions]) => {
        const filtered = (actions as any[]).filter((a: any) =>
          a.label.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      },
      {} as typeof actionsGroupedByCategory
    );
  }, [query, actionsGroupedByCategory, activeTab]);

  const orderedEntries = useMemo(() => {
    return Object.entries(filteredGroups);
  }, [filteredGroups]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-lg font-semibold text-gray-900">Select action</h2>
          <button
            onClick={closeSidePanel}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <XIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search actions..."
            className="w-full h-9 pl-8 pr-3 text-sm border-gray-300 rounded-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "all" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
            All
            {activeTab === "all" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("flow")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "flow" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            Flow
            {activeTab === "flow" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("call")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "call" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Call
            {activeTab === "call" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "contact" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Contact
            {activeTab === "contact" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("searches")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "searches" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <SearchIcon className="w-3.5 h-3.5" />
            Searches
            {activeTab === "searches" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("communication")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "communication" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Communication
            {activeTab === "communication" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {orderedEntries.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-6">
            No results{query ? ` for "${query}"` : ""}.
          </div>
        )}

        {orderedEntries.map(([category, actions], categoryIndex) => (
          <div key={categoryIndex} className="mb-4 last:mb-0">
            {/* Category Header */}
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              {category}
            </h3>

            {/* Actions List */}
            <div className="space-y-0.5">
              {(actions as any[]).map((action: any) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => setSelectedAction(action.value)}
                    className="w-full text-left px-2.5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-medium text-gray-900 leading-tight">
                            {action.label}
                          </div>
                          {action.tag && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                              {action.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionsList;
