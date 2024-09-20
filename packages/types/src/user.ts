import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  description: string;
  tag: string[];
  gender: string;
  head_image: null | string;
  is_active: number;
  is_default: number;
  is_leader: number;
}

export type { UserInfo };
