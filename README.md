# Workflow Builder POC

A proof-of-concept workflow automation builder built with **Next.js**, **React Flow**, **Dagre**, **Web Workers**, and **Comlink**.

## 🚀 **Features**

### **Core Architecture**
- **React Flow**: Visual node-based workflow canvas with drag & drop
- **Dagre**: Automatic graph layout and positioning in Web Workers
- **Comlink**: Type-safe Web Worker communication
- **Zustand**: Clean state management without Redux complexity
- **TypeScript**: Full type safety throughout the application

### **Visual Workflow Builder**
- 🎨 **Interactive Canvas** - Drag, drop, connect nodes visually
- 🔗 **Smart Connections** - Click and drag between node handles
- 📏 **Auto-layout** - Intelligent node positioning using Dagre
- 🎯 **Node Selection** - Click to select nodes and edges
- 🗺️ **Mini-map** - Navigate large workflows easily

### **Node Types**
- **🟢 Start Node** - Workflow entry point
- **🔵 Action Node** - Execute operations/functions
- **🟡 Condition Node** - Branching logic and decisions
- **🟣 Transform Node** - Data transformation operations
- **🔴 End Node** - Workflow completion point

### **Web Worker Processing**
- ⚡ **Background Layout** - Dagre computations don't block UI
- 🔄 **Workflow Execution** - Run workflows in separate thread
- 📊 **Progress Tracking** - Real-time execution progress
- 🛡️ **Error Handling** - Graceful error management and reporting

### **Workflow Management**
- ✅ **Validation** - Check workflow integrity before execution
- ▶️ **Execution** - Run workflows with real-time progress
- 💾 **Import/Export** - Save/load workflows as JSON
- 🌟 **Demo Mode** - Pre-built example workflow
- 🔄 **Reset** - Clear workspace instantly

## 📦 **Tech Stack**

```json
{
  "frontend": ["Next.js 15", "React 19", "TypeScript"],
  "visualization": ["React Flow", "Lucide Icons"],
  "layout": ["Dagre (auto-layout)"],
  "workers": ["Web Workers", "Comlink"],
  "state": ["Zustand"],
  "styling": ["Tailwind CSS", "shadcn/ui"]
}
```

## 🏃‍♂️ **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd workflow-builder-fe

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## 🎮 **How to Use**

### **1. Load Demo Workflow**
Click the **"Demo"** button to load a pre-built example workflow showcasing all node types.

### **2. Add Nodes**
Use the toolbar buttons to add different types of nodes:
- **Start** - Begin your workflow
- **Action** - Add processing steps  
- **Condition** - Add branching logic
- **Transform** - Transform data
- **End** - Complete your workflow

### **3. Connect Nodes**
- Drag from any **green handle** (source) to a **blue handle** (target)
- Create complex workflows with multiple paths

### **4. Auto-Layout**
Click **"Auto Layout"** to automatically organize your nodes using the Dagre algorithm.

### **5. Validate & Execute**
- **Validate** - Check if your workflow is properly structured
- **Execute** - Run the workflow and see real-time progress

### **6. Save & Load**
- **Export** - Save your workflow as JSON
- **Import** - Load previously saved workflows

## 🏗️ **Architecture**

### **Directory Structure**
```
src/
├── app/                 # Next.js app router
├── components/
│   ├── canvas/         # React Flow canvas component
│   ├── nodes/          # Custom node components
│   └── Toolbar.tsx     # Main toolbar
├── hooks/
│   └── useWorkflowWorker.ts  # Comlink worker hook
├── lib/
│   ├── worker-types.ts      # TypeScript interfaces
│   ├── demo-workflow.ts     # Sample workflow data
│   └── utils.ts            # Utilities
├── store/
│   └── workflow-store.ts   # Zustand state management
└── workers/
    └── workflow-worker.ts  # TypeScript worker (for reference)

public/
└── workflow-worker-comlink.js  # Actual worker file
```

### **Web Worker Communication Flow**

```
UI Component → useWorkflowWorker Hook → Comlink → Web Worker → Dagre/Execution Engine
     ↑                                                                    ↓
Progress Updates ← Comlink Proxy ← Progress Callback ← Worker Results ←
```

### **State Management**

```typescript
// Zustand Store Structure
interface WorkflowState {
  nodes: WorkflowNode[];           // All workflow nodes
  edges: WorkflowEdge[];           // Connections between nodes
  selectedNodeId: string | null;   // Currently selected node
  executionProgress: ExecutionProgress[]; // Real-time execution updates
  // ... actions and computed values
}
```

## 🔧 **Key Components**

### **WorkflowCanvas** (`src/components/canvas/index.tsx`)
- React Flow integration
- Node drag & drop handling
- Connection management
- Auto-layout triggering

### **Custom Nodes** (`src/components/nodes/`)
- Base node component with common functionality
- Specialized nodes for different workflow steps
- Handle positioning and styling

### **useWorkflowWorker** (`src/hooks/useWorkflowWorker.ts`)
- Comlink-based worker communication
- Layout computation requests
- Workflow execution management
- Progress tracking

### **Workflow Worker** (`public/workflow-worker-comlink.js`)
- Dagre layout algorithm
- Workflow execution engine
- Topological sorting for execution order
- Progress reporting via Comlink

## 🚀 **Advanced Features**

### **Execution Engine**
- **Topological Sorting** - Ensures correct execution order
- **Batch Processing** - Parallel execution of independent nodes
- **Progress Tracking** - Real-time updates during execution
- **Error Recovery** - Graceful handling of node failures

### **Layout Algorithm**
- **Dagre Integration** - Hierarchical graph layout
- **Customizable Options** - Direction, spacing, node sizes
- **Web Worker Processing** - Non-blocking layout computation

### **Type Safety**
- Full TypeScript coverage
- Comlink type-safe worker communication
- Strongly typed workflow definitions

## 🛠️ **Development**

### **Adding New Node Types**

1. Create node component in `src/components/nodes/`
2. Add to `nodeTypes` export in `src/components/nodes/index.ts`
3. Update worker execution logic in `public/workflow-worker-comlink.js`
4. Add toolbar button in `src/components/Toolbar.tsx`

### **Extending Worker Functionality**

1. Modify worker API in `public/workflow-worker-comlink.js`
2. Update TypeScript interface in `src/hooks/useWorkflowWorker.ts`
3. Add new methods to hook implementation

## 📈 **Performance**

- **Web Workers** - All heavy computations run in background threads
- **Lazy Loading** - Components loaded on demand
- **Optimized Rendering** - React Flow handles large graphs efficiently
- **Memory Management** - Proper cleanup of worker resources

## 🔮 **Future Enhancements**

- [ ] **Custom Node Editor** - Visual node property editing
- [ ] **Workflow Templates** - Pre-built workflow templates
- [ ] **Real-time Collaboration** - Multi-user workflow editing
- [ ] **Plugin System** - Extensible node types
- [ ] **Workflow Scheduler** - Automated workflow execution
- [ ] **Version Control** - Workflow history and branching
- [ ] **Performance Metrics** - Execution time and resource usage

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, React Flow, Dagre, and Web Workers**