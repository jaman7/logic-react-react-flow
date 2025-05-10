import { FC } from 'react';
import classNames from 'classnames';
import { Position } from '@xyflow/react';
import LogicGatePort from './LogicGatePort';
import { LogicGateActivePorts } from '@/shared/types/logic-flow';
import { LogicGateType } from '@/shared/types/logic-gate';
import { LogicGateEnum, LogicGateName, LogicGateTypeName } from '@/shared/enums/LogicGate';
import './LogicGateIcon.scss';
import { LogicGates } from '@/shared/const/LogicGate';

const { AND, OR, NOT, NAND, NOR, XOR, XNOR } = LogicGateEnum;
const { A, B, Y } = LogicGateName;
const { INPUT, OUTPUT } = LogicGateTypeName;

interface LogicGateIconProps {
  type: LogicGateType;
  className?: string;
  inputs?: string[];
  outputs?: string[];
  activePorts?: LogicGateActivePorts;
  selected?: boolean;
  onConnect?: (startId: string, endId: string) => void;
}

const LogicGateIcon: FC<LogicGateIconProps> = ({ type, className, inputs = [A, B], outputs = [Y], activePorts, selected }) => {
  const commonProps = {
    className: classNames('gate-icon', className, { selected }),
    viewBox: '0 0 118 100',
  };

  const getLineY = (index: number, total: number): number => {
    const spacing = 60 / (total + 1);
    return 20 + spacing * (index + 1);
  };

  const renderInputLines = () =>
    inputs.map((label, i) => {
      const y = getLineY(i, inputs.length);
      const isActive = activePorts?.inputs?.[i];

      return (
        <LogicGatePort
          key={`${INPUT}-${label}-${i}-${y}`}
          id={`${INPUT}-${label}`}
          position={Position.Left}
          x={6}
          y={y}
          label={label}
          type={INPUT}
          active={isActive}
        />
      );
    });

  const renderOutputLines = () =>
    outputs.map((label, i) => {
      const y = getLineY(i, outputs.length);
      const isActive = activePorts?.outputs?.[i];

      return (
        <LogicGatePort
          key={`${OUTPUT}-${label}-${i}-${y}`}
          id={`${OUTPUT}-${label}`}
          position={Position.Right}
          x={112}
          y={y}
          label={label}
          type={OUTPUT}
          active={isActive}
        />
      );
    });

  const renderShape = () => {
    switch (type) {
      case AND:
        return <path d="M26,20 h30 a34,30 0 0,1 0,60 h-30 z" />;
      case NAND:
        return <path d="M26,20 h30 a26,30 0 0,1 0,60 h-30 z" />;
      case OR:
        return <path d="M22,20 Q36,50 22,79 Q64,80 91,50 Q64,20 22,20" />;
      case NOR:
        return <path d="M22,20 Q36,50 20,80 Q64,80 81,50 Q64,20 20,20" />;
      case XOR:
        return (
          <>
            <path d="M25,20 Q36,50 25,80 Q67,80 91,50 Q67,20 25,20" />
            <path d="M21,20 Q32,50 21,80" />
          </>
        );
      case XNOR:
        return (
          <>
            <path d="M25,20 Q36,50 25,80 Q67,80 81,50 Q67,20 25,20" />
            <path d="M21,20 Q32,50 21,80" />
          </>
        );
      case NOT:
        return <polygon points="26,20 26,80 81,50" />;
      default:
        return null;
    }
  };

  const renderCircle = () => {
    if (type === NOT) return <circle cx="86" cy="50" r="4" />;
    if (type === NAND) return <circle cx="86" cy="50" r="4" />;
    if (type === NOR) return <circle cx="86" cy="50" r="4" />;
    if (type === XNOR) return <circle cx="86" cy="50" r="4" />;
    return null;
  };

  const renderLabel = () => {
    if (LogicGates.some((el: string) => el === type)) {
      return (
        <text fontSize="8" fontWeight="100" strokeWidth="0.8" x={type === NOT ? 40 : 45} y={53}>
          {type}
        </text>
      );
    }
    return null;
  };

  return (
    <svg {...commonProps}>
      {renderInputLines()}
      {renderOutputLines()}
      {renderLabel()}
      {renderShape()}

      {renderCircle()}
    </svg>
  );
};

export default LogicGateIcon;
