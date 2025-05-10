import { insertExplicitAnd, parseBooleanExpressionToTree } from '../logic-expression-parser';

jest.mock('i18next', () => ({
  t: (key: string, options?: any) => (options ? `${key} ${JSON.stringify(options)}` : key),
}));

describe('logic-expression-parser', () => {
  describe('insertExplicitAnd', () => {
    it('should insert · between adjacent variables/literals', () => {
      expect(insertExplicitAnd('AB')).toBe('A·B');
      expect(insertExplicitAnd('(A+B)C')).toBe('(A+B)·C');
      expect(insertExplicitAnd("A'B")).toBe('¬A·B');
      expect(insertExplicitAnd("A'(B+C)")).toBe('¬A·(B+C)');
      expect(insertExplicitAnd('A1')).toBe('A1');
    });
  });

  describe('parseBooleanExpressionToTree', () => {
    it('should parse single variable', () => {
      const ast = parseBooleanExpressionToTree('A');
      expect(ast).toEqual({ type: 'input', name: 'A' });
    });

    it('should parse NOT expression', () => {
      const ast = parseBooleanExpressionToTree("A'");
      expect(ast).toEqual({ type: 'NOT', child: { type: 'input', name: 'A' } });
    });

    it('should parse AND expression', () => {
      const ast = parseBooleanExpressionToTree('A·B');
      expect(ast).toEqual({
        type: 'AND',
        children: [
          { type: 'input', name: 'A' },
          { type: 'input', name: 'B' },
        ],
      });
    });

    it('should parse OR expression', () => {
      const ast = parseBooleanExpressionToTree('A+B');
      expect(ast).toEqual({
        type: 'OR',
        children: [
          { type: 'input', name: 'A' },
          { type: 'input', name: 'B' },
        ],
      });
    });

    it('should parse nested expression: A + B·C', () => {
      const ast = parseBooleanExpressionToTree('A+B·C');
      expect(ast).toEqual({
        type: 'OR',
        children: [
          { type: 'input', name: 'A' },
          {
            type: 'AND',
            children: [
              { type: 'input', name: 'B' },
              { type: 'input', name: 'C' },
            ],
          },
        ],
      });
    });

    it('should throw on unexpected character', () => {
      expect(() => parseBooleanExpressionToTree('A@B')).toThrow();
    });

    it('should throw on unclosed parentheses', () => {
      expect(() => parseBooleanExpressionToTree('(A+B')).toThrow();
    });

    it('should throw on unexpected token', () => {
      expect(() => parseBooleanExpressionToTree('*')).toThrow();
    });
  });
});
