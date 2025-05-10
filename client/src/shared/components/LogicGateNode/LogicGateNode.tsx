import { FC, useMemo } from 'react';
import { NodeProps, Position, useReactFlow, XYPosition } from '@xyflow/react';
import LogicGateIcon from './LogicGateIcon';
import { v4 as uuidv4 } from 'uuid';
import { LogicGateActivePorts } from '@/shared/types/logic-flow';
import { LogicGateType } from '@/shared/types/logic-gate';
import { LogicGateEnum, LogicGateName, LogicGateTypeName } from '@/shared/enums/LogicGate';
import './LogicGateNode.scss';

const { NOT } = LogicGateEnum;
const { A, B, Y } = LogicGateName;
const { DEFAULT } = LogicGateTypeName;

export interface LogicGateNodeData extends Record<string, unknown> {
  type: string;
  inputs?: string[];
  outputs?: string[];
  id: string;
  position: XYPosition;
  width?: number;
  height?: number;
  data: Record<string, unknown>;
  sourcePosition?: Position;
  targetPosition?: Position;
  dragHandle?: string;
  parentId?: string;
}

const LogicGateNode: FC<NodeProps<LogicGateNodeData>> = ({ data, selected }) => {
  const inputs: string[] = Array.isArray(data?.inputs) ? data.inputs : data.type === NOT ? [A] : [A, B];
  const outputs: string[] = Array.isArray(data?.outputs) ? data.outputs : [Y];

  const reactFlowInstance = useReactFlow();

  const activePorts = useMemo(
    () =>
      ({
        inputs: inputs?.map(() => selected) ?? [],
        outputs: outputs?.map(() => selected) ?? [],
      }) as LogicGateActivePorts,
    [selected, inputs.length, outputs.length]
  );

  const handleConnect = (startId: string, endId: string) => {
    const edge = {
      id: uuidv4(),
      source: startId,
      target: endId,
      type: DEFAULT,
    };
    reactFlowInstance.addEdges([edge]);
  };

  return (
    <div className="logic-gate-node">
      <LogicGateIcon
        type={data.type as LogicGateType}
        inputs={inputs}
        outputs={outputs}
        activePorts={activePorts}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default LogicGateNode;
