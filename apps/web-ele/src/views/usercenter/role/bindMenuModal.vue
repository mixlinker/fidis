<script lang="ts" setup>
import type { ComponentSize, FormInstance } from 'element-plus';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { bindMenuApi, getMenuListApi, getRoleApi, unBindMenuApi } from '#/api';
import { $t } from '#/locales';

interface menuItemType {
  name: string;
  id: number;
}

const menuList = ref<menuItemType[]>();
/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();
const menuIdList = ref<number[]>();

interface RuleForm {
  menu_id_list: number[];
  id: number;
}
const Form = ref<RuleForm>({
  id: 0,
  menu_id_list: [],
});

/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value.id = 0;
    Form.value.menu_id_list = [];
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      const addMenuList: number[] = [];
      const deleteMenuList: number[] = [];

      Form.value.menu_id_list.forEach((item) => {
        if (!menuIdList.value?.includes(item)) {
          addMenuList.push(item);
        }
      });
      menuIdList.value?.forEach((item) => {
        if (!Form.value?.menu_id_list.includes(item)) {
          deleteMenuList.push(item);
        }
      });
      addMenuList.length > 0 &&
        bindMenuApi({ id: Form.value.id, menu_id_list: addMenuList });
      deleteMenuList.length > 0 &&
        unBindMenuApi({ id: Form.value.id, menu_id_list: deleteMenuList });
      modalApi.close();
    }
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<RuleForm>();
      Form.value.id = data.id;
      getMenuListApi({
        page_index: 1,
        page_size: 999,
      }).then((res) => {
        menuList.value = res.data;
      });
      getRoleApi({ id: data.id }).then((res) => {
        Form.value.menu_id_list = res.menus.map((item) => item.id);
        menuIdList.value = res.menus.map((item) => item.id);
      });
    }
  },
});
</script>

<template>
  <Modal
    :centered="true"
    :title="$t('page.role.bind-menu-title')"
    class="w-[50%]"
  >
    <el-form
      ref="FormRef"
      :model="Form"
      :size="formSize"
      label-width="auto"
      status-icon
    >
      <el-form-item :label="$t('page.role.menu')" prop="name">
        <el-select v-model="Form.menu_id_list" multiple>
          <el-option
            v-for="item in menuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </Modal>
</template>
