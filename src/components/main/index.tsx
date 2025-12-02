import { WorkflowCanvas } from "../canvas";
import SidePanel from "../side-panel";

const Main = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <WorkflowCanvas />
      <SidePanel />
    </div>
  );
};

export default Main;