import { requestClient } from '#/api/request';

interface ListParams {
  page_index: number;
  page_size: number;
  [key: string]: any;
}
/**
 * 列表
 */
export async function getReportListApi(data: ListParams) {
  data.action = 'get_plan_list';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 添加
 */
export async function addReportApi(data: any) {
  data.action = 'add_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}

/**
 * 编辑
 */
export async function editReportApi(data: any) {
  data.action = 'edit_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}

/**
 * 删除
 */
export async function delReportApi(data: any) {
  data.action = 'delete_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}

/**
 * 详情
 */
export async function getReportItemApi(data: any) {
  data.action = 'get_plan_detail';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 手动执行
 */
export async function runReportApi(data: any) {
  data.action = 'run_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 开启
 */
export async function startReportApi(data: any) {
  data.action = 'start_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 关闭
 */
export async function stopReportApi(data: any) {
  data.action = 'stop_plan';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 结果列表
 */
export async function getReportResultApi(data: any) {
  data.action = 'get_result_list';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}

/**
 * 上传
 */
export async function uploadFileApi(data: any) {
  return requestClient.upload('/upload', data);
}

/**
 * 结果列表
 */
export async function getReportResultListApi(data: ListParams) {
  data.action = 'report_result_list';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
/**
 * 列表
 */
export async function delReportResultListApi(data: any) {
  data.action = 'delete_task';
  data.block_mapping = 'report';
  return requestClient.post<any>('/api', data);
}
