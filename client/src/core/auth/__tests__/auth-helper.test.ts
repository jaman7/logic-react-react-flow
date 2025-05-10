import {
  cookiesAuth,
  cookiesAuthRemove,
  decodeBase64,
  encodeBase64,
  isBeforeRefreshTokenExpiration,
  isRefreshTokenExist,
} from '../auth-helper';

import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe('auth-helper', () => {
  const mockTokenData = {
    refreshTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
  };

  const encoded = encodeBase64(mockTokenData);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should encode and decode base64 correctly', () => {
    const encoded = encodeBase64(mockTokenData);
    const decoded = decodeBase64<typeof mockTokenData>(encoded);
    expect(decoded).toEqual(mockTokenData);
  });

  it('should return false if no userInfo in cookies (isBeforeRefreshTokenExpiration)', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    expect(isBeforeRefreshTokenExpiration(30_000)).toBe(false);
  });

  it('should return true if token is near expiration (isBeforeRefreshTokenExpiration)', () => {
    const nearExpiry = new Date(Date.now() + 10_000).toISOString();
    (Cookies.get as jest.Mock).mockReturnValue(encodeBase64({ refreshTokenExpiresAt: nearExpiry }));

    const result = isBeforeRefreshTokenExpiration(30_000);
    expect(result).toBe(true);
  });

  it('should return false if token is far from expiration (isBeforeRefreshTokenExpiration)', () => {
    const farExpiry = new Date(Date.now() + 5 * 60_000).toISOString();
    (Cookies.get as jest.Mock).mockReturnValue(encodeBase64({ refreshTokenExpiresAt: farExpiry }));

    const result = isBeforeRefreshTokenExpiration(30_000);
    expect(result).toBe(false);
  });

  it('should return true if refreshToken exists', () => {
    (Cookies.get as jest.Mock).mockReturnValue(encoded);
    expect(isRefreshTokenExist()).toBe(true);
  });

  it('should return false if no cookie', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    expect(isRefreshTokenExist()).toBe(false);
  });

  it('should return parsed cookiesAuth', () => {
    (Cookies.get as jest.Mock).mockReturnValue(encoded);
    expect(cookiesAuth()).toEqual(mockTokenData);
  });

  it('should call Cookies.remove on cookiesAuthRemove', () => {
    cookiesAuthRemove();
    expect(Cookies.remove).toHaveBeenCalledWith('userInfo');
  });

  it('should return true if current time is near refreshTokenExpiresAt', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 10000).toISOString();

    (Cookies.get as jest.Mock).mockReturnValue(encodeBase64({ refreshTokenExpiresAt: future }));

    expect(isBeforeRefreshTokenExpiration(10000)).toBe(true);
  });
});
