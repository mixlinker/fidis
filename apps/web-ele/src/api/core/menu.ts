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
export async function getMenuListApi(data: companyApi.ListParams) {
  return requestClient.post<any>('/auth/menu/list', data);
}

/**
 * 添加
 */
export async function addMenuApi(data: any) {
  return requestClient.post<any>('/auth/menu/create', data);
}

/**
 * 编辑
 */
export async function editMenuApi(data: any) {
  return requestClient.post<any>('/auth/menu/update', data);
}

/**
 * 删除
 */
export async function delMenuApi(data: { id: number }) {
  return requestClient.post<any>('/auth/menu/delete', data);
}

/**
 * 详情
 */
export async function getMenuApi(data: { id: number }) {
  return requestClient.post<any>('/auth/menu/detail', data);
}

/**
 * 用户菜单
 */
interface userMenuItem {
  id: number;
  name: string;
  url: string;
  list_order: string;
}
export async function getUserMenuApi() {
  return requestClient.post<userMenuItem[]>('/auth/menu/user-menu');
}
