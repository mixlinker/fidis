import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(id: number) {
  return requestClient.post<UserInfo>('/auth/user/detail', { id });
}

namespace companyApi {
  /** 列表接口参数 */
  export interface ListParams {
    page_index: number;
    page_size: number;
    [key: string]: any;
  }
}
/**
 * 列表
 */
export async function getUserListApi(data: companyApi.ListParams) {
  return requestClient.post<any>('/auth/user/list', data);
}

/**
 * 添加
 */
export async function addUserApi(data: any) {
  return requestClient.post<any>('/auth/user/create', data);
}

/**
 * 编辑
 */
export async function editUserApi(data: any) {
  return requestClient.post<any>('/auth/user/update', data);
}

/**
 * 删除
 */
export async function delUserApi(data: { id: number }) {
  return requestClient.post<any>('/auth/user/delete', data);
}

/**
 * 详情
 */
export async function getUserApi(data: { id: number }) {
  return requestClient.post<any>('/auth/user/detail', data);
}

/**
 * 绑定数据
 */
export async function userBindDataApi(data: {
  source_type: string;
  uid_list: string[];
  user_id: number;
}) {
  return requestClient.post<any>('/auth/user/bind-datum', data);
}

/**
 * 解绑数据
 */
export async function userUbindDataApi(data: {
  source_type: string;
  uid_list: string[];
  user_id: number;
}) {
  return requestClient.post<any>('/auth/user/unbind-datum', data);
}

/**
 * 绑定数据列表
 */
export async function getUserBindDataApi(data: { user_id: number }) {
  return requestClient.post<any>('/auth/user/datum', data);
}
