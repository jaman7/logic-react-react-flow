import { convertBinaryToHex } from '../convertBinaryToHex';

describe('convertBinaryToHex', () => {
  test('converts valid binary strings to hex', () => {
    expect(convertBinaryToHex('1010')).toBe('A');
    expect(convertBinaryToHex('1111')).toBe('F');
    expect(convertBinaryToHex('0000')).toBe('0');
    expect(convertBinaryToHex('1100100')).toBe('64');
  });

  test('returns null for invalid binary strings', () => {
    expect(convertBinaryToHex('1021')).toBeNull();
    expect(convertBinaryToHex('abc')).toBeNull();
    expect(convertBinaryToHex('')).toBeNull();
    expect(convertBinaryToHex(null)).toBeNull();
  });
});
