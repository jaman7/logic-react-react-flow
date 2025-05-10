export interface IAuthUser {
  id?: string;
  createdAt?: string;
  email?: string;
  password?: string;
  lastName?: string;
  name?: string;
  role?: string;
  dateSync?: string;
  verificationCode?: string;
  verified?: string;
}

export interface IAuth {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  status?: string;
}

export interface IUseAuth {
  auth?: IAuth | null;
  user?: IAuthUser | null;
  login?: (email: string, password: string) => Promise<void>;
  signup?: (name: string, email: string, password: string, passwordConfirm: string) => Promise<IAuthUser | null>;
  logout?: () => Promise<void>;
  refreshToken?: () => Promise<void>;
}
