import { requestClient } from '#/api/request';

/**
 * 获取sql地址
 */
export async function getSqlAddressApi(data: any) {
  data.action = 'get_mysql_ip';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 设置sql地址
 */
export async function setSqlAddressApi(data: any) {
  data.action = 'set_mysql_ip';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 获取数据库写入设置
 */
export async function getSqlTableConfigApi(data: any) {
  data.action = 'get_table_config';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 设置数据库写入设置
 */
export async function setSqlTableConfigApi(data: any) {
  data.action = 'set_table_config';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 重置sql连接
 */
export async function resetSqlConnectApi(data: any) {
  data.action = 'reset_rdbproxy';
  return requestClient.post<any>('/proxy/api', data);
}
