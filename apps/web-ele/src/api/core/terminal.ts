import { requestClient } from '#/api/request';

interface ListParams {
  page_index: number;
  page_size: number;
  [key: string]: any;
}

/**
 * 列表
 */
export async function getTerminalListApi(data: ListParams) {
  data.action = 'get_terminal_list';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 添加
 */
export async function addTerminalApi(data: any) {
  data.action = 'create_terminal';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 编辑
 */
export async function editTerminalApi(data: any) {
  data.action = 'update_terminal';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 *  刷新
 */
export async function refreshTerminalApi(data: any) {
  data.action = 'get_terminal_status';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 *  下载终端
 */
export async function downloadTerminalApi(data: any) {
  data.action = 'download_last_lua_file';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 *  给终端发送指令
 */
export async function commandTerminalApi(data: any) {
  data.action = 'publish_terminal_command';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 删除
 */
export async function delTerminalApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'delete_terminal';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 上下线记录
 */
export async function getTerminalOnlineApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'get_grid_list';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 导出报文
 */
export async function exportTerminalGridApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'export_grid_data';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 记录列表
 */
export async function getExportListApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'get_history_list';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 详情
 */
export async function getTerminalItemApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'get_terminal_item';
  return requestClient.post<any>('/proxy/api', data);
}

/* 终端配置 */
/**
 * 列表
 */
export async function getTerminalConfigListApi(data: ListParams) {
  data.action = 'get_terminal_config_list';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 添加
 */
export async function addTerminalConfigApi(data: any) {
  data.action = 'create_terminal_config';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 编辑
 */
export async function editTerminalConfigApi(data: any) {
  data.action = 'update_terminal_config';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 删除
 */
export async function delTerminalConfigApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'delete_terminal_config';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 详情
 */
export async function getTerminalConfigItemApi(data: {
  [key: string]: any;
  id?: number;
}) {
  data.action = 'get_terminal_config_item';
  return requestClient.post<any>('/proxy/api', data);
}
