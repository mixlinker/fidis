<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getMenuApi } from '#/api';

const route = useRoute();
interface detailDataType {
  name: string;
  tag: string[];
  list_order: number;
  created_at: string;
  updated_at: string;
  description: string;
}
const detailData = ref<detailDataType>();
const tag = ref<string[]>();

onMounted(async () => {
  const result = await getMenuApi({ id: Number(route.params.id) });
  detailData.value = result;
  if (detailData.value?.tag) {
    tag.value = detailData.value.tag;
  }
});
</script>

<template>
  <div class="m-3 h-full bg-white">
    <div class="p-2">
      <el-descriptions :title="$t('common.base-info')" border>
        <el-descriptions-item :label="$t('page.company.name')">
          {{ detailData?.name }}
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
        <el-descriptions-item :label="$t('common.sort')">
          {{ detailData?.list_order }}
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
