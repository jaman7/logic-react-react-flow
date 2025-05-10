import { LogicGateEnum } from '@/shared/enums/LogicGate';
import { isBinaryGateNode, isInputNode, isLiteralNode, isNotNode, logicGateFunction } from '../logicGateFunction';

describe('logicGateFunction', () => {
  test.each([
    [LogicGateEnum.AND, [true, true], true],
    [LogicGateEnum.AND, [true, false], false],
    [LogicGateEnum.OR, [true, false], true],
    [LogicGateEnum.OR, [false, false], false],
    [LogicGateEnum.NOT, [true], false],
    [LogicGateEnum.NOT, [false], true],
    [LogicGateEnum.NAND, [true, true], false],
    [LogicGateEnum.NOR, [false, false], true],
    [LogicGateEnum.XOR, [true, false], true],
    [LogicGateEnum.XOR, [true, true], false],
    [LogicGateEnum.XNOR, [true, true], true],
    [LogicGateEnum.XNOR, [true, false], false],
  ])('should evaluate %s gate with %p as %p', (type, inputs, expected) => {
    expect(logicGateFunction(type, inputs)).toBe(expected);
  });

  test('should return false for unknown gate type', () => {
    expect(logicGateFunction('UNKNOWN' as any, [true, true])).toBe(false);
  });
});

describe('type guards for AST', () => {
  test('isInputNode', () => {
    expect(isInputNode({ type: 'input', name: 'A' })).toBe(true);
    expect(isInputNode({ type: 'NOT', child: {} as any })).toBe(false);
  });

  test('isNotNode', () => {
    expect(isNotNode({ type: 'NOT', child: {} as any })).toBe(true);
    expect(isNotNode({ type: 'input', name: 'A' })).toBe(false);
  });

  test('isBinaryGateNode', () => {
    expect(isBinaryGateNode({ type: 'AND', children: [] })).toBe(true);
    expect(isBinaryGateNode({ type: 'XOR', children: [] })).toBe(true);
    expect(isBinaryGateNode({ type: 'NOT', child: {} as any })).toBe(false);
  });

  test('isLiteralNode', () => {
    expect(isLiteralNode({ type: 'literal', value: '1' })).toBe(true);
    expect(isLiteralNode({ type: 'input', name: 'B' })).toBe(false);
  });
});
