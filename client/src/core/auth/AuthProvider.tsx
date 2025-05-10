import { createContext, JSX, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { cookiesAuth, cookiesAuthRemove, encodeBase64, isBeforeRefreshTokenExpiration, isRefreshTokenExist } from './auth-helper';
import { IAuth, IAuthUser, IUseAuth } from './auth.model';
import HttpService from '../services/http/http.service';
import { useGlobalStore } from '@/store/useGlobalStore';
import { initializeData } from '@/hooks/useInitializeData';
import { useNavigate } from 'react-router-dom';
import { IAuthPath } from '@/pages/auth/auth.enum';

export const AuthContext = createContext<IUseAuth | null>(null);

const { PATH_LOGIN } = IAuthPath;

const AuthProvider = ({ children }: { children?: JSX.Element | any }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);

  const httpService = new HttpService();
  const timeBefore = 30000;
  const authCookies: IAuth | null = cookiesAuth() || null;
  const { clearStore } = useGlobalStore();
  const navigate = useNavigate();

  const fetchUser = async (): Promise<IAuthUser | null> => {
    try {
      const userData: IAuthUser = await httpService.get('users/me');
      setUser(userData ?? null);
      return userData ?? null;
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      cookiesAuthRemove();
      clearStore();

      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res: IAuth = await httpService.post('auth/login', { email, password });
      const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res ?? {};
      const data: IAuth = {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt?.toLocaleString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: new Date(accessTokenExpiresAt?.toLocaleString() as string),
      });
      fetchUser().then((res) => {
        if (res?.id) initializeData();
      });
    } catch (e) {
      console.error(e);
    }
  };

  const signup = async (name: string, email: string, password: string, passwordConfirm: string): Promise<IAuthUser | null> => {
    try {
      const res: IAuthUser = await httpService.post('auth/signup', { name, email, password, passwordConfirm });
      return { verificationCode: res?.verificationCode };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const logout = async () => {
    try {
      await httpService.get('auth/logout');
      clearStore();
      setUser(null);
      cookiesAuthRemove();
      navigate(PATH_LOGIN);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshToken = async (): Promise<void> => {
    const cookieAuth = cookiesAuth() || {};
    const { refreshToken } = cookieAuth || {};

    if (!refreshToken) {
      logout();
      return Promise.reject('No refresh token available');
    }

    try {
      const response: IAuth = await httpService.post('auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response ?? {};
      const data: IAuth = {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt?.toLocaleString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: new Date(accessTokenExpiresAt?.toLocaleString() as string),
      });
      return Promise.resolve();
    } catch (e) {
      logout();
      return Promise.reject(e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const cookieAuth = cookiesAuth() || {};
    if (user?.id && cookieAuth?.refreshTokenExpiresAt) {
      interval = setInterval(async () => {
        if (isRefreshTokenExist() && isBeforeRefreshTokenExpiration(timeBefore)) await refreshToken();
      }, timeBefore);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const { refreshToken } = cookiesAuth() || {};
    if (!user?.id && refreshToken) {
      fetchUser().then((res) => {
        if (res?.id) initializeData();
      });
    }
  }, []);

  return <AuthContext.Provider value={{ auth: authCookies || {}, user, login, logout, signup }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
