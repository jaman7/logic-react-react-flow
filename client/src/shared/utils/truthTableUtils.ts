import { LogicGateEnum } from '../enums/LogicGate';
import { LogicGateType } from '../types/logic-gate';
import { TruthTableRowBool } from '../types/truth-table';
import { logicGateFunction } from './logicGateFunction';

const { NOT } = LogicGateEnum;

const generateCombinations = (length: number): boolean[][] => {
  const result: boolean[][] = [];

  const generate = (current: boolean[]) => {
    if (current.length === length) {
      result.push(current);
      return;
    }
    generate([...current, false]);
    generate([...current, true]);
  };

  generate([]);
  return result;
};

export const generateTruthTable = (type: LogicGateType): TruthTableRowBool[] => {
  const inputCount = type === NOT ? 1 : 2;
  const combinations = generateCombinations(inputCount);

  return combinations.map((inputs) => ({
    inputs,
    output: logicGateFunction(type, inputs),
  }));
};
