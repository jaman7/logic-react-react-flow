import { FC } from 'react';
import { Handle, Position, useNodeId } from '@xyflow/react';
import { colors } from '@/shared/const/colors';
import './LogicGatePort.scss';

interface LogicGatePortProps {
  id: string;
  position: Position;
  x: number;
  y: number;
  label: string;
  active?: boolean;
  type: 'input' | 'output';
}

const { blue, green } = colors;

const LogicGatePort: FC<LogicGatePortProps> = ({ id, position, x, y, label, active, type }) => {
  const nodeId = useNodeId();
  return (
    <g>
      <text
        x={type === 'input' ? x + 8 : x - 8}
        y={y - 3}
        fontSize="6"
        fontWeight="100"
        strokeWidth="0.5"
        textAnchor={type === 'input' ? 'start' : 'end'}
      >
        {label}
      </text>
      <line
        x1={type === 'input' ? x : x - 20}
        y1={y}
        x2={type === 'input' ? x + 20 : x}
        y2={y}
        stroke="black"
        strokeWidth="2"
        strokeLinecap="square"
        className={active ? (type === 'input' ? 'stroke-blue' : 'stroke-green') : ''}
      />
      {nodeId && (
        <foreignObject x={type === 'input' ? x + 2 : x + 1.5} y={y + 1.5} requiredExtensions="http://www.w3.org/1999/xhtml">
          <Handle
            type={type === 'input' ? 'target' : 'source'}
            position={position}
            id={id}
            style={{
              position: 'absolute',
              background: active ? (type === 'input' ? blue : green) : blue,
            }}
          />
        </foreignObject>
      )}
    </g>
  );
};

export default LogicGatePort;
