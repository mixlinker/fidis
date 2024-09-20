import { requestClient } from '#/api/request';

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
export async function getRoleListApi(data: companyApi.ListParams) {
  return requestClient.post<any>('/auth/role/list', data);
}

/**
 * 添加
 */
export async function addRoleApi(data: any) {
  return requestClient.post<any>('/auth/role/create', data);
}

/**
 * 编辑
 */
export async function editRoleApi(data: any) {
  return requestClient.post<any>('/auth/role/update', data);
}

/**
 * 删除
 */
export async function delRoleApi(data: { id: number }) {
  return requestClient.post<any>('/auth/role/delete', data);
}

/**
 * 详情
 */
interface detailDataType {
  name: string;
  tag: string[];
  is_active: number;
  list_order: number;
  created_at: string;
  updated_at: string;
  description: string;
  menus: { id: number }[];
}
export async function getRoleApi(data: { id: number }) {
  return requestClient.post<detailDataType>('/auth/role/detail', data);
}

/**
 * 绑定菜单
 */
export async function bindMenuApi(data: {
  id: number;
  menu_id_list: number[];
}) {
  return requestClient.post<any>('/auth/role/bind-menu', data);
}

/**
 * 解绑菜单
 */
export async function unBindMenuApi(data: {
  id: number;
  menu_id_list: number[];
}) {
  return requestClient.post<any>('/auth/role/unbind-menu', data);
}
