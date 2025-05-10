import { LogicGateEnum, LogicGateTypeName } from '../enums/LogicGate';
import { LogicGateBinaryType, LogicGateType } from '../types/logic-gate';
import { LogicGateAST } from '../types/LogicGateAST';

const { AND, OR, NOT, NAND, NOR, XOR, XNOR } = LogicGateEnum;
const { INPUT, LITERAL } = LogicGateTypeName;

export const logicGateFunction = (type: LogicGateType, inputs: boolean[]): boolean => {
  const [a, b = false] = inputs;

  switch (type) {
    case AND:
      return a && b;
    case OR:
      return a || b;
    case NOT:
      return !a;
    case NAND:
      return !(a && b);
    case NOR:
      return !(a || b);
    case XOR:
      return a !== b;
    case XNOR:
      return a === b;
    default:
      return false;
  }
};

export const isInputNode = (ast: LogicGateAST): ast is { type: 'input'; name: string } => {
  return ast?.type === INPUT;
};

export const isNotNode = (ast: LogicGateAST): ast is { type: 'NOT'; child: LogicGateAST } => {
  return ast?.type === NOT;
};

export const isBinaryGateNode = (ast: LogicGateAST): ast is { type: LogicGateBinaryType; children: LogicGateAST[] } => {
  return [AND, OR, NAND, NOR, XOR, XNOR]?.includes(ast?.type as LogicGateEnum);
};

export const isLiteralNode = (node: LogicGateAST): node is { type: 'literal'; value: '0' | '1' } => node?.type === LITERAL;
