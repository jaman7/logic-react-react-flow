import GateSimulator from './components/GateSimulator';
import { ReactFlowProvider } from '@xyflow/react';
import { LogicGateType } from '@/shared/types/logic-gate';
import { LogicGates } from '@/shared/const/LogicGate';
import './Dashboard.scss';

const gates: LogicGateType[] = LogicGates;

const Dashboard: React.FC = () => {
  return (
    <ReactFlowProvider>
      <div className="dashboard bg-white">{gates?.map((gate, i) => <GateSimulator key={i} type={gate} />)}</div>
    </ReactFlowProvider>
  );
};

export default Dashboard;
