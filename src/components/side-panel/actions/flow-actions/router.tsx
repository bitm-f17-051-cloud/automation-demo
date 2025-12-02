import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Split, GripVertical } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflow.store";

type RouterActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

type Route = {
  id: string;
  label: string;
};

const RouterAction = ({ goBack, nodeData, selectedAction }: RouterActionProps) => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  // If we're editing a route node, find the parent intermediate node
  const getParentNodeData = () => {
    if (selectedAction === 'flow_router_path') {
      // Find the parent intermediate node (the one that connects to this route)
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          console.log("Parent node data:", parentNode.data);
          return parentNode.data;
        }
      }
      console.log("Could not find parent node, using nodeData:", nodeData);
    }
    return nodeData;
  };

  const effectiveNodeData = getParentNodeData();
  console.log("Effective node data:", effectiveNodeData);
  const [actionName, setActionName] = useState(effectiveNodeData?.label || effectiveNodeData?.config?.nodeName || "Router");

  // Bootstrap routes from nodeData
  const bootstrapRoutes = (): Route[] => {
    try {
      // Try multiple possible locations for routes data
      const savedRoutes = 
        effectiveNodeData?.config?.routes || 
        effectiveNodeData?.routes || 
        effectiveNodeData?.config?.properties?.find((p: any) => p.key === "routes")?.value;
      
      console.log("Saved routes:", savedRoutes);
      
      if (savedRoutes && Array.isArray(savedRoutes) && savedRoutes.length > 0) {
        return savedRoutes;
      }
    } catch (error) {
      console.error("Error loading routes:", error);
    }
    
    // Always return a default array
    return [
      { id: "route-1", label: "Route 1" },
      { id: "route-2", label: "Route 2" }
    ];
  };

  const [routes, setRoutes] = useState<Route[]>(() => {
    const initialRoutes = bootstrapRoutes();
    console.log("Initial routes:", initialRoutes);
    return initialRoutes || [];
  });

  const addRoute = () => {
    const newId = `route-${Date.now()}`;
    const newRoute: Route = {
      id: newId,
      label: `Route ${(routes || []).length + 1}`
    };
    setRoutes([...(routes || []), newRoute]);
  };

  const removeRoute = (id: string) => {
    // Must have at least 2 routes
    if ((routes || []).length > 2) {
      setRoutes((routes || []).filter(r => r.id !== id));
    }
  };

  const updateRouteLabel = (id: string, label: string) => {
    setRoutes((routes || []).map(r => r.id === id ? { ...r, label } : r));
  };

  const saveAction = () => {
    if (!selectedNodeId) return;

    // Determine the target node ID (parent intermediate node or current node)
    let targetNodeId = selectedNodeId;
    if (selectedAction === 'flow_router_path') {
      // Find the parent intermediate node
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          targetNodeId = parentNode.id;
        }
      }
    }

    // Ensure routes is valid
    const validRoutes = routes && Array.isArray(routes) ? routes : [
      { id: "route-1", label: "Route 1" },
      { id: "route-2", label: "Route 2" }
    ];

    const properties = [];
    
    // Add routes to properties
    properties.push({ key: "routes", value: validRoutes });

    // Create route configs for each route
    const routeConfigs = validRoutes.map((route) => {
      const routeConfig = {
        nodeName: route.label,
        nodeType: "flow_router_path",
        nodeIcon: "flow_router",
        properties: [{ key: "routeId", value: route.id }],
        routeId: route.id,
      };
      console.log("Creating route config:", routeConfig);
      return routeConfig;
    });

    const config = {
      nodeName: "Router", // This triggers the intermediate node creation
      nodeType: "flow_router",
      nodeIcon: "flow_router",
      properties: properties,
      routes: validRoutes,
    };

    console.log("Saving Router config:", config);
    console.log("Route configs:", routeConfigs);
    console.log("Target node ID:", targetNodeId);
    
    // Check if this is an edit by looking for existing route nodes
    const existingRouteNodes = edges.filter(edge => edge.source === targetNodeId && nodes.find(n => n.id === edge.target && n.type === 'condition'));
    const isEdit = existingRouteNodes.length > 0;
    
    console.log("Is Edit?", isEdit, "Existing route nodes:", existingRouteNodes.length);
    
    if (isEdit) {
      // Find routes that were removed
      const oldRoutes = effectiveNodeData?.config?.routes || effectiveNodeData?.routes || [];
      const newRouteIds = validRoutes.map(r => r.id);
      const routesToDelete = Array.isArray(oldRoutes) 
        ? oldRoutes
            .filter((oldRoute: any) => !newRouteIds.includes(oldRoute.id))
            .map((route: any) => route.label)
        : [];
      
      console.log("Routes to delete:", routesToDelete);
      
      // Update the intermediate node config (without creating new nodes)
      updateNodeConfig(targetNodeId, config, false);
      
      // Use the dedicated update function for route nodes
      // We'll reuse the updateConditionNodeConfig since routes work similarly
      const updateConditionNodeConfig = useWorkflowStore.getState().updateConditionNodeConfig;
      updateConditionNodeConfig(targetNodeId, routeConfigs, routesToDelete);
    } else {
      // Create new routes
      updateNodeConfig(targetNodeId, config, true, validRoutes.length, routeConfigs);
    }
    
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Split className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Router</h2>
              <p className="text-sm text-gray-500">Create multiple parallel paths</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Router Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Router Name</Label>
            <Input
              placeholder="Enter router name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Routes */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-4 block uppercase text-xs tracking-wide">Routes</Label>
            <div className="space-y-3">
              {(routes || []).map((route, index) => (
                <div key={route.id} className="border border-gray-200 rounded-lg bg-white">
                  {/* Route Header */}
                  <div className="p-3 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Route {index + 1}</span>
                    </div>
                    {(routes || []).length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeRoute(route.id)}
                        className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Route Content */}
                  <div className="p-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">Route Name</Label>
                      <Input
                        placeholder="Enter route name"
                        value={route.label}
                        onChange={(e) => updateRouteLabel(route.id, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Route Button */}
              <button
                type="button"
                onClick={addRoute}
                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Route
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button onClick={saveAction} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
};

export default RouterAction;
