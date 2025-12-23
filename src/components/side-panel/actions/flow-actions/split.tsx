import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Split, Plus, X } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflow.store";
import { v4 as uuidv4 } from "uuid";

type SplitActionProps = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
  selectedAction: string;
};

type Path = {
  id: string;
  name: string;
  percentage: number;
};

const SplitAction = ({ goBack, nodeData, selectedAction }: SplitActionProps) => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  // If we're editing a path node, find the parent intermediate node
  const getParentNodeData = () => {
    if (selectedAction === 'flow_split_path') {
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          return parentNode.data;
        }
      }
    }
    return nodeData;
  };

  const effectiveNodeData = getParentNodeData();
  const [actionName, setActionName] = useState(
    effectiveNodeData?.label || effectiveNodeData?.config?.nodeName || "Split"
  );

  // Bootstrap paths from nodeData
  const bootstrapPaths = (): Path[] => {
    try {
      const savedPaths = 
        effectiveNodeData?.config?.paths || 
        effectiveNodeData?.paths || 
        effectiveNodeData?.config?.properties?.find((p: any) => p.key === "paths")?.value;
      
      if (savedPaths && Array.isArray(savedPaths) && savedPaths.length > 0) {
        return savedPaths;
      }
    } catch (error) {
      console.error("Error loading paths:", error);
    }
    
    // Default paths - start with 2 paths with 50-50 split
    return [
      { id: uuidv4(), name: "Path A", percentage: 50 },
      { id: uuidv4(), name: "Path B", percentage: 50 }
    ];
  };

  const [paths, setPaths] = useState<Path[]>(() => {
    const initialPaths = bootstrapPaths();
    return initialPaths || [];
  });

  const addPath = () => {
    const pathLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const nextLetter = pathLetters[paths.length] || String.fromCharCode(65 + paths.length);
    const newPath: Path = {
      id: uuidv4(),
      name: `Path ${nextLetter}`,
      percentage: 0
    };
    setPaths([...paths, newPath]);
  };

  const removePath = (id: string) => {
    if (paths.length > 1) {
      setPaths(paths.filter(p => p.id !== id));
    }
  };

  const updatePathName = (id: string, name: string) => {
    setPaths(paths.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePathPercentage = (id: string, percentage: number) => {
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setPaths(paths.map(p => p.id === id ? { ...p, percentage: clampedPercentage } : p));
  };

  const saveAction = () => {
    if (!selectedNodeId) return;

    let targetNodeId = selectedNodeId;
    if (selectedAction === 'flow_split_path') {
      const incomingEdge = edges.find(edge => edge.target === selectedNodeId);
      if (incomingEdge) {
        const parentNode = nodes.find(node => node.id === incomingEdge.source);
        if (parentNode && parentNode.type === 'intermediate') {
          targetNodeId = parentNode.id;
        }
      }
    }

    const validPaths = paths && Array.isArray(paths) ? paths : [];

    const properties = [];
    properties.push({ key: "paths", value: validPaths });

    // Create path configs for each path
    const pathConfigs = validPaths.map((path) => ({
      nodeName: path.name,
      nodeType: "flow_split_path",
      nodeIcon: "flow_split",
      properties: [
        { key: "pathId", value: path.id },
        { key: "percentage", value: `${path.percentage}%` }
      ],
      pathId: path.id,
      percentage: path.percentage,
    }));

    const config = {
      nodeName: "Split",
      nodeType: "flow_split",
      nodeIcon: "flow_split",
      properties: properties,
      paths: validPaths,
    };

    // Check if this is an edit
    const existingPathNodes = edges.filter(
      edge => edge.source === targetNodeId && 
      nodes.find(n => n.id === edge.target && n.type === 'condition')
    );
    const isEdit = existingPathNodes.length > 0;

    if (isEdit) {
      const oldPaths = effectiveNodeData?.config?.paths || effectiveNodeData?.paths || [];
      const newPathIds = validPaths.map(p => p.id);
      const pathsToDelete = Array.isArray(oldPaths)
        ? oldPaths
            .filter((oldPath: any) => !newPathIds.includes(oldPath.id))
            .map((path: any) => path.name)
        : [];

      updateNodeConfig(targetNodeId, config, false);
      const updateConditionNodeConfig = useWorkflowStore.getState().updateConditionNodeConfig;
      updateConditionNodeConfig(targetNodeId, pathConfigs, pathsToDelete);
    } else {
      updateNodeConfig(targetNodeId, config, true, validPaths.length, pathConfigs);
    }

    goBack();
  };

  // Calculate total percentage
  const totalPercentage = paths.reduce((sum, path) => sum + path.percentage, 0);

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
              <h2 className="text-lg font-semibold text-gray-900">Split</h2>
              <p className="text-sm text-gray-500">Distribute workflow across multiple paths</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Action Name</Label>
            <Input
              placeholder="Enter action name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Paths */}
          <div>
            <div className="mb-2">
              <Label className="text-sm font-semibold text-gray-900 uppercase text-xs tracking-wide">PATHS</Label>
              <p className="text-xs text-gray-500 mt-1">Enter path name and percentage</p>
            </div>
            <div className="space-y-3">
              {paths.map((path) => (
                <div key={path.id} className="flex items-center gap-3">
                  <Input
                    placeholder="Path name"
                    value={path.name}
                    onChange={(e) => updatePathName(path.id, e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={path.percentage || ""}
                      onChange={(e) => updatePathPercentage(path.id, Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  {paths.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePath(path.id)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3 text-gray-700" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Path Button */}
              <button
                type="button"
                onClick={addPath}
                className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-gray-600" />
                </div>
                Add Path
              </button>

              {/* Total Percentage Display */}
              {paths.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Total: <span className={`font-medium ${totalPercentage === 100 ? 'text-green-600' : totalPercentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                      {totalPercentage}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button 
          onClick={saveAction} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={paths.length === 0 || totalPercentage !== 100}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SplitAction;

