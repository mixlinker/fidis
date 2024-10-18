import { requestClient } from '#/api/request';

/**
 * 列表
 */
export async function getInDataSourceApi() {
  return requestClient.post<{ name: string; type: string }[]>(
    '/data-source/list',
  );
}

/* 
  停止
*/
export async function stopDataSourceApi(data: { id: number }) {
  return requestClient.post<any>('/data-source/stop', data);
}

/* 
  启用
*/
export async function startDataSourceApi(data: { id: number }) {
  return requestClient.post<any>('/data-source/start', data);
}
/* 
  结果列表
*/
export async function getDataSourceResultApi(data: { id: number }) {
  return requestClient.post<any>('/data-source/datum', data);
}
