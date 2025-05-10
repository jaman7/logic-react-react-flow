import { act, renderHook } from '@testing-library/react';
import AuthProvider from '../AuthProvider';
import Cookies from 'js-cookie';
import HttpService from '@/core/services/http/http.service';
import { IAuthUser } from '../auth.model';
import { useAuth } from '../userAuth';

jest.mock('js-cookie');
jest.mock('@/core/services/http/http.service');
jest.mock('@/store/useGlobalStore', () => ({
  useGlobalStore: () => ({
    clearStore: jest.fn(),
  }),
}));
jest.mock('@/hooks/useInitializeData', () => ({
  initializeData: jest.fn(),
}));

describe('AuthProvider', () => {
  const mockUser: IAuthUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    (Cookies.set as jest.Mock).mockClear();
    (HttpService.prototype.post as jest.Mock).mockClear();
    (HttpService.prototype.get as jest.Mock).mockClear();
  });

  it('should login and store user info in cookies', async () => {
    (HttpService.prototype.post as jest.Mock).mockResolvedValueOnce({
      accessToken: 'token',
      refreshToken: 'refresh',
      accessTokenExpiresAt: new Date().toISOString(),
      refreshTokenExpiresAt: new Date().toISOString(),
    });

    (HttpService.prototype.get as jest.Mock).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await result.current?.login?.('test@example.com', 'password');
    });

    expect(Cookies.set).toHaveBeenCalled();
  });

  it('should logout and clear user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await result.current?.logout?.();
    });

    expect(Cookies.remove).toHaveBeenCalledWith('userInfo');
  });
});
