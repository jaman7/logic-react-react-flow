import { MinimizedFunction } from '@/pages/LogicMinimizer/LogicMinimizer.model';
import { generateASTMapFromMinimizedFunctions } from '../generate-ast-map';

jest.mock('i18next', () => ({
  t: (key: string, options?: any) => `${key} ${JSON.stringify(options)}`,
}));

describe('generateASTMapFromMinimizedFunctions', () => {
  it('should generate valid AST for correct expressions', () => {
    const input: MinimizedFunction[] = [
      { label: 'F1', expression: 'A+B' },
      { label: 'F2', expression: 'A·B' },
    ];

    const result = generateASTMapFromMinimizedFunctions(input);

    expect(result.F1).toBeDefined();
    expect(result.F2).toBeDefined();
    expect(result.F1?.type).toBe('OR');
    expect(result.F2?.type).toBe('AND');
  });

  it('should skip invalid expressions and warn', () => {
    const input: MinimizedFunction[] = [
      { label: 'F1', expression: 'A+B' },
      { label: 'F2', expression: 'A@@B' }, // Invalid
    ];

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = generateASTMapFromMinimizedFunctions(input);

    expect(result.F1).toBeDefined();
    expect(result.F2).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('expressionParseError'));

    warnSpy.mockRestore();
  });

  it('should return empty map for empty input', () => {
    const result = generateASTMapFromMinimizedFunctions([]);
    expect(result).toEqual({});
  });
});
