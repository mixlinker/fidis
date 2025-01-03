import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    desc: string;
    realName: string;
    userId: string;
    username: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<string>('/login', data);
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/logout');
}

/**
 * 退出登录
 */
export async function getUserByToken() {
  return requestClient.post<any>('/auth/get-user-by-token');
}

/**
 * 代理转发
 */
export async function proxyApi(data: any) {
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 获取授权配置
 */
export async function getAuthConfig() {
  return requestClient.post<any>('/auth/config/detail');
}

/**
 * 获取授权配置
 */
export async function setAuthConfig(data: {
  app_id: string;
  app_secret: string;
  id: number;
}) {
  return requestClient.post<any>('/auth/config/detail', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
