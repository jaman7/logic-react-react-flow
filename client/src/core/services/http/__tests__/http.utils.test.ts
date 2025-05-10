import { buildQueryString, preparedHttpParamsValue, toHttpParams } from '../../http/http.utils';

describe('http.utils', () => {
  describe('preparedHttpParamsValue', () => {
    it('should convert a string to string', () => {
      expect(preparedHttpParamsValue('abc')).toBe('abc');
    });

    it('should convert an array to joined string', () => {
      expect(preparedHttpParamsValue(['a', 'b', 'c'])).toBe('a&b&c');
    });

    it('should convert number to string', () => {
      expect(preparedHttpParamsValue(123)).toBe('123');
    });
  });

  describe('toHttpParams', () => {
    it('should return empty params for undefined', () => {
      const result = toHttpParams(undefined);
      expect(result.toString()).toBe('');
    });

    it('should convert simple object', () => {
      const result = toHttpParams({ a: 1, b: 'test' });
      expect(result.toString()).toBe('a=1&b=test');
    });

    it('should convert array to comma-separated value', () => {
      const result = toHttpParams({ items: ['x', 'y'] });
      expect(decodeURIComponent(result.toString())).toBe('items=x,y');
    });

    it('should skip undefined/null values', () => {
      const result = toHttpParams({ a: undefined, b: null, c: 'ok' });
      expect(result.toString()).toBe('c=ok');
    });
  });

  describe('buildQueryString', () => {
    it('should build simple query string', () => {
      const result = buildQueryString({ a: 1, b: 'test' });
      expect(result).toBe('a=1&b=test');
    });

    it('should handle arrays correctly', () => {
      const result = buildQueryString({ items: ['x', 'y'] });
      expect(result).toBe('items=x&items=y');
    });

    it('should handle nested objects', () => {
      const result = buildQueryString({
        filter: {
          name: 'john',
          age: 30,
        },
      });
      expect(result).toBe('filter%5Bname%5D=john&filter%5Bage%5D=30'); // URL encoded
    });

    it('should skip undefined/null values', () => {
      const result = buildQueryString({ a: undefined, b: null, c: 'keep' });
      expect(result).toBe('c=keep');
    });
  });
});
