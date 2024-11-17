<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getCompanyListApi, getRoleListApi, getUserApi } from '#/api';

/* 组织列表 */
interface companyItemType {
  name: string;
  id: number;
}
type companyType = companyItemType[];
const companyList = ref<companyType>([]);
/* 角色列表 */
const roleList = ref<companyType>([]);

const route = useRoute();
interface detailDataType {
  name: string;
  alias: string;
  gender: string;
  mobile: string;
  email: string;
  organization_id: number;
  is_leader: number;
  tag: string[];
  role_id_list: number[];
  is_active: number;
  created_at: string;
  updated_at: string;
  description: string;
}
const detailData = ref<detailDataType>();
const tag = ref<string[]>();

onMounted(async () => {
  const [resultCompany, resultRole] = await Promise.all([
    getCompanyListApi({
      page_index: 1,
      page_size: 999,
    }),
    getRoleListApi({
      page_index: 1,
      page_size: 999,
    }),
  ]);
  companyList.value = resultCompany.data;
  roleList.value = resultRole.data;
  const result = await getUserApi({ id: Number(route.params.id) });
  detailData.value = result;
  if (detailData.value?.tag) {
    tag.value = detailData.value.tag;
  }
});
</script>

<template>
  <div class="bg-background m-3 h-full">
    <div class="p-[12px]">
      <el-descriptions :title="$t('common.base-info')" border>
        <el-descriptions-item :label="$t('page.user.name')">
          {{ detailData?.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('page.user.alias')">
          {{ detailData?.alias }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('page.user.by_org')">
          {{
            companyList.find((item) => item.id === detailData?.organization_id)
              ?.name
          }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('page.user.by_role')">
          <el-tag
            v-for="(item, index) in detailData?.role_id_list"
            :key="index"
            class="mr-1"
            type="primary"
          >
            {{ roleList.find((ele) => ele.id === item)?.name }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('page.user.is_leader')">
          {{ detailData?.is_leader === 1 ? $t('common.yes') : $t('common.no') }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.gender')">
          {{ detailData?.gender }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.mobile')">
          {{ detailData?.mobile }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.email')">
          {{ detailData?.email }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.tag')">
          <el-tag
            v-for="(item, index) in tag"
            :key="index"
            class="mr-1"
            type="primary"
          >
            {{ item }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.status')">
          {{
            detailData?.is_active === 1 ? $t('common.start') : $t('common.stop')
          }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.created_at')">
          {{ detailData?.created_at }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.updated_at')">
          {{ detailData?.updated_at }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.description')">
          {{ detailData?.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
