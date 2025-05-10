import { isNumeric, mathOperation } from '../math-operaation';

describe('mathOperation', () => {
  test('adds integers correctly', () => {
    expect(mathOperation(1, 2)).toBe(3);
  });

  test('adds floats with precision', () => {
    expect(mathOperation(1.1, 2.2)).toBeCloseTo(3.3, 5);
    expect(mathOperation(0.1, 0.2)).toBeCloseTo(0.3, 5);
  });

  test('subtracts integers correctly', () => {
    expect(mathOperation(5, 3, false)).toBe(2);
  });

  test('subtracts floats with precision', () => {
    expect(mathOperation(0.3, 0.1, false)).toBeCloseTo(0.2, 5);
  });

  test('handles null and undefined inputs', () => {
    expect(mathOperation(null, 2)).toBe(2);
    expect(mathOperation(3, undefined)).toBe(3);
    expect(mathOperation(undefined, undefined)).toBe(0);
    expect(mathOperation(null, null)).toBe(0);
  });

  test('handles undefined isIncrement (default true)', () => {
    expect(mathOperation(1.5, 1.5)).toBeCloseTo(3.0, 5);
  });
});

describe('isNumeric', () => {
  it('should return true for number values', () => {
    expect(isNumeric(123)).toBe(true);
    expect(isNumeric(-45.6)).toBe(true);
  });

  it('should return true for numeric strings', () => {
    expect(isNumeric('42')).toBe(true);
    expect(isNumeric('3.14')).toBe(true);
  });

  it('should return false for non-numeric strings', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('')).toBe(false);
  });

  it('should return false for null, undefined, or objects', () => {
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric({})).toBe(false);
    expect(isNumeric([])).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isNumeric(NaN)).toBe(false);
  });
});
