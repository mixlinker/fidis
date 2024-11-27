import { requestClient } from '#/api/request';

interface ListParams {
  page_index: number;
  page_size: number;
  [key: string]: any;
}

/* 
plan_list: {block_mapping: "report", action: "get_plan_list"},
report_plan_item: {block_mapping: "report", action: "get_plan_detail"},
run_plan: {block_mapping: "report", action: "run_plan"},
run_report_plan: {block_mapping: "report", action: "start_plan"},
stop_report_plan: {block_mapping: "report", action: "stop_plan"},
delete_report_plan: {block_mapping: "report", action: "delete_plan"},
add_report_plan: {block_mapping: "report", action: "add_plan"},
edit_report_plan: {block_mapping: "report", action: "edit_plan"},
report_result_list: {block_mapping: "report", action: "get_result_list"},

*/
/**
 * 列表
 */
export async function getReportListApi(data: ListParams) {
  data.action = 'get_plan_list';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 添加
 */
export async function addReportApi(data: any) {
  data.action = 'add_report_plan';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 编辑
 */
export async function editReportApi(data: any) {
  data.action = 'edit_report_plan';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 删除
 */
export async function delReportApi(data: any) {
  data.action = 'delete_plan';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 详情
 */
export async function getReportItemApi(data: any) {
  data.action = 'report_plan_item';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 开启
 */
export async function runReportApi(data: any) {
  data.action = 'run_plan';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 关闭
 */
export async function closeReportApi(data: any) {
  data.action = 'stop_report_plan';
  return requestClient.post<any>('/proxy/api', data);
}
/**
 * 结果列表
 */
export async function getReportResultApi(data: any) {
  data.action = 'get_result_list';
  return requestClient.post<any>('/proxy/api', data);
}

/**
 * 上传
 */
export async function uploadFileApi(data: any) {
  return requestClient.upload('/proxy/api', data);
}
