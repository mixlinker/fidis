import { requestClient } from '#/api/request';

namespace companyApi {
  /** 列表接口参数 */
  export interface ListParams {
    page_index: number;
    page_size: number;
  }
}
/**
 * 获取组织列表
 */
export async function getCompanyListApi(data: companyApi.ListParams) {
  return requestClient.post<any>('/auth/organization/list', data);
}

/**
 * 添加组织
 */
export async function addCompanyApi(data: any) {
  return requestClient.post<any>('/auth/organization/create', data);
}

/**
 * 编辑组织
 */
export async function editCompanyApi(data: any) {
  return requestClient.post<any>('/auth/organization/update', data);
}

/**
 * 删除组织
 */
export async function delCompanyApi(data: { id: number }) {
  return requestClient.post<any>('/auth/organization/delete', data);
}

/**
 * 组织详情
 */
export async function getCompanyDetailApi(data: { id: number }) {
  return requestClient.post<any>('/auth/organization/detail', data);
}
