<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useClipboard } from '@vueuse/core';
import { ElMessage } from 'element-plus';

import { getReportItemApi } from '#/api';
import { $t } from '#/locales';

const route = useRoute();
interface reportItemType {
  file_name: string;
  plan_type: number;
  output_type: string;
  [key: string]: any;
}
const detailData = ref<reportItemType>();
const typeOption: { [key: number]: string } = {
  1: $t('report.project.year_report'),
  2: $t('report.project.month_report'),
  3: $t('report.project.date_report'),
  4: $t('report.project.classes_report'),
  5: $t('report.project.other_report'),
};
const executeOption: { [key: number]: string } = {
  0: $t('report.project.hand_run'),
  1: $t('report.project.per_year'),
  2: $t('report.project.per_month'),
  3: $t('report.project.per_date'),
  4: $t('report.project.per_hour'),
  5: $t('report.project.time_task'),
};
/* 下载文件 */
const downFile = (url: string | undefined) => {
  if (!url) return;
  const path = `${window.location.origin}/download/${url}`;
  window.open(path);
};

const formatScript = (script: string | undefined) => {
  if (!script) return;
  return JSON.stringify(JSON.parse(script), null, 4);
};

/* 扩展信息 */
const { copy } = useClipboard({ legacy: true });
const copyScript = async (script: string | undefined) => {
  if (!script) return;
  await copy(JSON.stringify(JSON.parse(script), null, 4));
  ElMessage.success($t('message.copy'));
};

onMounted(async () => {
  const result = await getReportItemApi({
    uid: route.params.id,
  });
  detailData.value = {
    ...result,
    plan_script: JSON.stringify(result.plan_script),
    type: result.run_type ? 1 : 0,
  };
});
</script>

<template>
  <div class="bg-background m-3 h-full">
    <div class="flex h-full flex-col p-[12px]">
      <div class="mb-[12px] font-bold">
        {{ $t('terminal.terminal.base_info') }}
      </div>
      <el-descriptions :column="3" border>
        <el-descriptions-item :label="$t('report.project.uid')">
          {{ detailData?.uid }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.project.name')">
          {{ detailData?.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.project.alias')">
          {{ detailData?.alias }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.project.report_type')">
          {{ detailData?.plan_type ? typeOption[detailData.plan_type] : '' }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('report.project.run_mode')">
          {{ executeOption[detailData?.type] ?? '' }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="detailData?.run_type === 5"
          :label="$t('report.project.time_task')"
        >
          {{ detailData.crontab || '' }}
        </el-descriptions-item>
        <el-descriptions-item v-else :label="$t('report.project.run_period')">
          <span v-if="[1].includes(detailData?.run_type)">{{
            detailData?.run_month + $t('common.month')
          }}</span>
          <span v-if="[1, 2].includes(detailData?.run_type)">{{
            detailData?.run_day + $t('common.date')
          }}</span>
          <span v-if="[1, 2, 3].includes(detailData?.run_type)">{{
            detailData?.run_hour + $t('common.hour')
          }}</span>
          <span v-if="[2, 3, 4].includes(detailData?.run_type)">{{
            detailData?.run_munit + $t('common.minute')
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.created_at')">
          {{ detailData?.created }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.updated_at')" :span="2">
          {{ detailData?.last_modified }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('report.project.report_template')"
          :span="3"
        >
          <div class="flex items-center justify-between">
            <el-link
              type="primary"
              @click="downFile(detailData?.template_file)"
            >
              <span>{{ detailData?.template_file }}</span>
            </el-link>
          </div>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.description')" :span="3">
          {{ detailData?.plan_description }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="flex flex-1 flex-col overflow-hidden">
        <div
          class="mt-[12px] flex items-center justify-between pb-[12px] pt-[12px] text-[16px]"
        >
          <div class="font-bold">{{ $t('report.project.excel_script') }}</div>
          <div class="flex cursor-pointer">
            <div class="mr-[8px]">
              <el-popover placement="top-start">
                <template #reference>
                  <el-icon @click="copyScript(detailData?.plan_script)">
                    <CopyDocument />
                  </el-icon>
                </template>
                {{ $t('script.copy') }}
              </el-popover>
            </div>
            <div class="mr-[8px]">
              <el-popover placement="top-start">
                <template #reference>
                  <el-icon><Crop /></el-icon>
                </template>
                {{ $t('script.view') }}
              </el-popover>
            </div>
          </div>
        </div>
        <div class="script-body flex-1">
          <pre>{{ formatScript(detailData?.plan_script) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.script-body {
  min-width: calc(100% - 22px);
  height: 100%;
  padding: 10px;
  margin-bottom: 12px;
  overflow: auto;
  color: #666;
  background-color: #fafafa;
  border: 1px solid #ccc;
}
</style>
