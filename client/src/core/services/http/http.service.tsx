import { environment as env } from '@/environments/environment';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams } from './http.models';
import { cookiesAuth } from '@/core/auth/auth-helper';
import { IAuth } from '@/core/auth/auth.model';
import Cookies from 'js-cookie';

class HttpService {
  private http: AxiosInstance;
  private baseURL = env.SERVER_API_URL;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.SERVER_API_URL;
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
    this.injectInterceptors();
  }

  private getAuthorization(): Record<string, string> {
    const cookie: IAuth = cookiesAuth() || {};
    return cookie?.accessToken ? { Authorization: `Bearer ${cookie?.accessToken}` } : {};
  }

  private setupHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...customHeaders,
      ...this.getAuthorization(),
    };
  }

  private async updateTokens(response: IAuth): Promise<void> {
    const { accessToken, refreshToken, refreshTokenExpiresAt } = response || {};
    if (accessToken && refreshToken) {
      Cookies.set(
        'userInfo',
        JSON.stringify({
          accessToken,
          refreshToken,
          accessTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
        }),
        { expires: new Date(refreshTokenExpiresAt || '') }
      );
    }
  }

  private async handleUnauthorized(error: any) {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken } = cookiesAuth() || {};
      try {
        const res = await axios.post('auth/refresh', { refreshToken });
        await this.updateTokens(res?.data ?? {});
        originalRequest.headers.Authorization = `Bearer ${res?.data?.accessToken ?? ''}`;
        return this.http(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }

  private injectInterceptors(): void {
    this.http.interceptors.request.use((config) => config);

    this.http.interceptors.response.use((response) => response, this.handleUnauthorized.bind(this));
  }

  private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get<T>(url: string, params?: IParams, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(customHeaders),
    });
  }

  public async post<T, P>(url: string, payload: P, params?: IParams, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(customHeaders),
    });
  }

  public async put<T, P>(url: string, payload: P, params?: IParams, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(customHeaders),
    });
  }

  public async patch<T, P>(url: string, payload: P, params?: IParams, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(EHttpMethod.PATCH, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(customHeaders),
    });
  }

  public async delete<T>(url: string, params?: IParams, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(customHeaders),
    });
  }
}

export default HttpService;
