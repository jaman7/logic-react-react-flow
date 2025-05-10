import { encodeBase64 } from '@/core/auth/auth-helper';
import { IAuth } from '@/core/auth/auth.model';
import axios from 'axios';
import Cookies from 'js-cookie';
import { EHttpMethod } from '../http.enum';
import HttpService from '../http.service';

jest.mock('axios');
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('HttpService', () => {
  const mockedAxios = {
    request: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(mockedAxios);
  });

  it('should call GET with correct params and headers', async () => {
    mockedAxios.request.mockResolvedValueOnce({ data: 'ok' });

    const service = new HttpService('http://api.test');
    const result = await service.get<string>('endpoint', { q: 'search' });

    expect(result).toBe('ok');
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: EHttpMethod.GET,
      url: 'endpoint',
      params: expect.any(URLSearchParams),
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    });
  });

  it('should call POST with payload and params', async () => {
    mockedAxios.request.mockResolvedValueOnce({ data: { status: 'ok' } });

    const service = new HttpService();
    const result = await service.post<{ status: string }, any>('endpoint', { foo: 'bar' });

    expect(result).toEqual({ status: 'ok' });
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: EHttpMethod.POST,
        url: 'endpoint',
        data: { foo: 'bar' },
      })
    );
  });

  it('should retry on 401 and update token', async () => {
    const refreshData: IAuth = {
      accessToken: 'newAccess',
      refreshToken: 'newRefresh',
      accessTokenExpiresAt: new Date().toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    };

    // instancja klasy
    const service = new HttpService();

    // cookies zawierają refresh token
    (Cookies.get as jest.Mock).mockReturnValue(encodeBase64({ refreshToken: 'expired-token' }));

    // axios.post zwraca nowe tokeny
    (axios as any).post = jest.fn().mockResolvedValueOnce({ data: refreshData });

    // http.request zwraca sukces po retry
    (service as any).http = jest.fn().mockResolvedValueOnce('retried-success');

    // ręczne wywołanie metody klasy z kontekstem
    const retryResult = await (service as any).handleUnauthorized.call(service, {
      response: { status: 401 },
      config: { _retry: false, headers: {} },
    });

    expect(axios.post).toHaveBeenCalledWith('auth/refresh', {
      refreshToken: 'expired-token',
    });

    expect(retryResult).toBe('retried-success');
  });

  it('should throw on error response', async () => {
    mockedAxios.request.mockRejectedValueOnce(new Error('fail'));

    const service = new HttpService();
    await expect(service.get('endpoint')).rejects.toThrow('fail');
  });
});
