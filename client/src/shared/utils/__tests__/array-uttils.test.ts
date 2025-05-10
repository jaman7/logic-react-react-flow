import { removeRowById } from '../array-uttils';

describe('removeRowById', () => {
  const sampleData = [
    { id: 1, value: 'A' },
    { id: 2, value: 'B' },
    { id: 3, value: 'C' },
  ];

  test('removes the correct row by id', () => {
    const result = removeRowById(sampleData, 2);
    expect(result).toEqual([
      { id: 1, value: 'A' },
      { id: 3, value: 'C' },
    ]);
  });

  test('returns the same array if id not found', () => {
    const result = removeRowById(sampleData, 999);
    expect(result).toEqual(sampleData);
  });

  test('returns empty array if input is empty', () => {
    const result = removeRowById([], 1);
    expect(result).toEqual([]);
  });

  test('handles null or undefined array safely', () => {
    // @ts-expect-error testing invalid input
    expect(removeRowById(null, 1)).toEqual([]);
    // @ts-expect-error testing invalid input
    expect(removeRowById(undefined, 1)).toEqual([]);
  });
});
