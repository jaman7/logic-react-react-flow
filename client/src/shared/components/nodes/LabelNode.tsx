import { FC } from 'react';
import { Handle, Position } from '@xyflow/react';
import { LogicGateTypeName } from '@/shared/enums/LogicGate';
import { colors } from '@/shared/const/colors';

const { INPUT, OUTPUT, LITERAL } = LogicGateTypeName;

interface LabelNodeData {
  label?: string;
  outputs?: string[];
  inputs?: string[];
}

const LabelNode: FC<{ data: LabelNodeData; type: string }> = ({ data, type }) => {
  const outputs: string[] = data?.outputs || [];
  const inputs: string[] = data?.inputs || [];
  const outputId = outputs?.[0] ? `${OUTPUT}-${outputs[0]}` : OUTPUT;
  const inputId = inputs?.[0] ? `${INPUT}-${inputs?.[0]}` : INPUT;

  return (
    <div className="p-1 rounded bg-gray-100 border text-xs relative">
      {typeof data?.label === 'string' ? data.label : ''}

      {type === INPUT || type === LITERAL ? (
        <Handle type="source" position={Position.Right} id={outputId} style={{ background: colors.blue }} />
      ) : null}

      {type === OUTPUT ? <Handle type="target" position={Position.Left} id={inputId} style={{ background: colors.blue }} /> : null}
    </div>
  );
};

export default LabelNode;
