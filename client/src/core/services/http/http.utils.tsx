export function preparedHttpParamsValue(value: any): string {
  if (value instanceof String) return value.toString();
  if (Array.isArray(value)) return value.join('&');

  return value.toString();
}

export function toHttpParams<T>(data: T): URLSearchParams {
  const params = new URLSearchParams();
  if (!data) return params;

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return params;
}

export const buildQueryString = (params: Record<string, any>): string => {
  const encode = (key: string, value: any): string => {
    if (Array.isArray(value)) {
      return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .map(([nestedKey, nestedValue]) => encode(`${key}[${nestedKey}]`, nestedValue))
        .join('&');
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  };

  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => encode(key, value))
    .join('&');
};
