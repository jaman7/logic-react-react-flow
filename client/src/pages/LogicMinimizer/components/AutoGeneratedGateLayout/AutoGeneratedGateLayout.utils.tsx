import { LogicGates } from '@/shared/const/LogicGate';
import { LogicGateEnum, LogicGateName, LogicGateTypeName } from '@/shared/enums/LogicGate';
import { LogicGateLayout } from '@/shared/types/LogicGateLayout';
import { Node, Edge } from '@xyflow/react';

const { NOT } = LogicGateEnum;
const { A, B, Y } = LogicGateName;
const { INPUT, OUTPUT, LOGICGATE, DEFAULT } = LogicGateTypeName;

export const updatedNodesMap = (layout: LogicGateLayout): Node[] => {
  const nodes = layout?.nodes?.map((node) => {
    const label = node.data?.label;

    if (node.type === DEFAULT && label && LogicGates.includes(label as LogicGateEnum)) {
      const isNotGate = label === NOT;
      return {
        ...node,
        type: LOGICGATE,
        data: {
          ...node.data,
          type: label,
          gateType: label,
          inputs: isNotGate ? [A] : [A, B],
          outputs: [Y],
        },
      };
    }

    if (node.type === INPUT) {
      return {
        ...node,
        data: {
          ...node.data,
          inputs: [],
          outputs: [Y],
        },
      };
    }

    if (node.type === OUTPUT) {
      return {
        ...node,
        data: {
          ...node.data,
          inputs: [A],
          outputs: [],
        },
      };
    }

    return node;
  });

  return nodes;
};

export const updatedEdgesMap = (layout: LogicGateLayout): Edge[] => {
  const connectionCounter: Record<string, number> = {};

  const edges = layout.edges.map((edge) => {
    const sourceNode = layout.nodes.find((n) => n.id === edge.source);
    const targetNode = layout.nodes.find((n) => n.id === edge.target);
    const sourceOutput = Array.isArray(sourceNode?.data?.outputs) ? sourceNode.data.outputs[0] : Y;
    const currentCount = connectionCounter[edge.target] ?? 0;
    connectionCounter[edge.target] = currentCount + 1;
    const targetInputs: string[] = (targetNode?.data?.inputs as string[]) ?? [A];
    const targetInput = targetInputs?.[currentCount] ?? A;
    const sourceHandle = `${OUTPUT}-${sourceOutput}`;
    const targetHandle = `${INPUT}-${targetInput}`;

    return {
      ...edge,
      sourceHandle,
      targetHandle,
      type: 'animatedSvg',
    };
  });

  return edges;
};
