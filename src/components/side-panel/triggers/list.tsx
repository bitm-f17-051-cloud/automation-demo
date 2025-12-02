import { Input } from "@/components/ui/input";
import { Grid3x3, Search, XIcon, UserCircle, Calendar, Webhook } from "lucide-react";
import {
  getTriggersGroupedByCategory,
} from "@/utils/side-panel/triggers/triggers.constants";
import { useMemo, useState } from "react";

type TriggersListProps = {
  setSelectedTrigger: (trigger: string) => void;
  closeSidePanel: () => void;
};

const TriggersList = ({ closeSidePanel, setSelectedTrigger }: TriggersListProps) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "scheduler" | "integration">("all");
  const triggersGroupedByCategory = getTriggersGroupedByCategory();

  // Filter triggers based on query and active tab
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    let groups = triggersGroupedByCategory;

    // Filter by tab
    if (activeTab === "contact") {
      groups = { "Contact": triggersGroupedByCategory["Contact"] || [] };
    } else if (activeTab === "scheduler") {
      groups = { "Scheduler": triggersGroupedByCategory["Scheduler"] || [] };
    } else if (activeTab === "integration") {
      groups = { "Integration": triggersGroupedByCategory["Integration"] || [] };
    }

    // Filter by search query
    if (!q) return groups;
    return Object.entries(groups).reduce(
      (acc, [category, triggers]) => {
        const filtered = triggers.filter((t: any) =>
          t.label.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      },
      {} as typeof triggersGroupedByCategory
    );
  }, [query, triggersGroupedByCategory, activeTab]);

  const orderedEntries = useMemo(() => {
    // Filter out empty categories
    return Object.entries(filteredGroups).filter(([category, triggers]) => 
      Array.isArray(triggers) && triggers.length > 0
    );
  }, [filteredGroups]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-lg font-semibold text-gray-900">Select trigger</h2>
          <button
            onClick={closeSidePanel}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <XIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search triggers..."
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
            onClick={() => setActiveTab("contact")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "contact" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            Contact
            {activeTab === "contact" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scheduler")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "scheduler" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Scheduler
            {activeTab === "scheduler" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("integration")}
            className={`relative px-3 py-2 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "integration" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            Integration
            {activeTab === "integration" && (
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

        {orderedEntries.map(([category, triggers], categoryIndex) => (
          <div key={categoryIndex} className="mb-4 last:mb-0">
            {/* Category Header */}
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              {category}
            </h3>

            {/* Trigger Items */}
            <div className="space-y-0.5">
              {triggers.map((trigger: any) => {
                const IconComponent = trigger.icon;
                return (
                  <button
                    key={trigger.value}
                    type="button"
                    onClick={() => setSelectedTrigger(trigger.value)}
                    className="w-full text-left px-2.5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 leading-tight">
                          {trigger.label}
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

export default TriggersList;
