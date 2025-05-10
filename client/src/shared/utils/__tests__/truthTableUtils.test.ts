import { LogicGateType } from '@/shared/types/logic-gate';
import { generateTruthTable } from '../truthTableUtils';

describe('generateTruthTable', () => {
  const gateTests: Record<LogicGateType, [boolean[], boolean][]> = {
    AND: [
      [[false, false], false],
      [[false, true], false],
      [[true, false], false],
      [[true, true], true],
    ],
    OR: [
      [[false, false], false],
      [[false, true], true],
      [[true, false], true],
      [[true, true], true],
    ],
    NOT: [
      [[false], true],
      [[true], false],
    ],
    NAND: [
      [[false, false], true],
      [[false, true], true],
      [[true, false], true],
      [[true, true], false],
    ],
    NOR: [
      [[false, false], true],
      [[false, true], false],
      [[true, false], false],
      [[true, true], false],
    ],
    XOR: [
      [[false, false], false],
      [[false, true], true],
      [[true, false], true],
      [[true, true], false],
    ],
    XNOR: [
      [[false, false], true],
      [[false, true], false],
      [[true, false], false],
      [[true, true], true],
    ],
  };

  Object.entries(gateTests).forEach(([gate, expectedRows]) => {
    test(`should generate correct truth table for ${gate}`, () => {
      const result = generateTruthTable(gate as LogicGateType);
      expect(result.length).toBe(expectedRows.length);
      expectedRows.forEach(([inputs, expectedOutput], index) => {
        expect(result[index].inputs).toEqual(inputs);
        expect(result[index].output).toBe(expectedOutput);
      });
    });
  });
});
