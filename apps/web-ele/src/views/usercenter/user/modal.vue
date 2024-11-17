<script lang="ts" setup>
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';

import { inject, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  addUserApi,
  editUserApi,
  getCompanyListApi,
  getRoleListApi,
} from '#/api';
import mixDynamisTags from '#/components/mix-dynamic-tag/index.vue';
import { $t } from '#/locales';

const getList = inject<() => void>('getList') as () => void;

const modalType = ref<string>('add');

/* 组织列表 */
interface companyItemType {
  name: string;
  id: number;
}
type companyType = companyItemType[];
const companyList = ref<companyType>([]);

/* 角色列表 */
const roleList = ref<companyType>([]);

/* 表单配置 */
const formSize = ref<ComponentSize>('default');
const FormRef = ref<FormInstance>();

interface roleItemType {
  id: number;
}
interface RuleForm {
  name: string;
  gender: string;
  alias: string;
  mobile: string;
  email: string;
  password?: string;
  list_order: number;
  is_leader: number;
  organization_id: number | string;
  tag: string[];
  role_id_list: number[];
  description: string;
  roles: roleItemType[];
}

const initForm = () => {
  return {
    alias: '',
    description: '',
    email: '',
    gender: '男',
    is_leader: 0,
    list_order: 0,
    mobile: '',
    name: '',
    organization_id: '',
    password: '',
    role_id_list: [],
    roles: [],
    tag: [],
  };
};
const Form = ref<RuleForm>(initForm());

const rules = reactive<FormRules<RuleForm>>({
  alias: [
    {
      message: $t('page.user.message.alias'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
  email: [
    {
      message: $t('page.user.message.email'),
      required: true,
      trigger: ['blur', 'change'],
    },
    {
      message: $t('page.user.message.eamil_reg'),
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i,
      trigger: ['blur'],
    },
  ],
  list_order: [
    {
      message: $t('page.company.message.list_order'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
  mobile: [
    {
      message: $t('page.user.message.mobile'),
      required: true,
      trigger: ['blur', 'change'],
    },
    {
      message: $t('page.user.message.mobile-reg'),
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      trigger: ['blur'],
    },
  ],
  name: [
    {
      message: $t('page.user.message.name'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
  organization_id: [
    {
      message: $t('page.user.message.by_org'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      message: $t('page.user.message.password'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
  role_id_list: [
    {
      message: $t('page.user.message.by_role'),
      required: true,
      trigger: ['blur', 'change'],
    },
  ],
});

/* 初始化弹窗 */
const [Modal, modalApi] = useVbenModal({
  onBeforeClose: () => {
    Form.value = initForm();
  },
  onConfirm: async () => {
    if (FormRef.value) {
      await FormRef.value.validate();
      await (modalType.value === 'add'
        ? addUserApi(Form.value)
        : editUserApi(Form.value));

      modalApi.close();
      getList();
    }
  },
  onOpenChange: async (isOpen) => {
    if (isOpen) {
      const data = modalApi.getData<RuleForm>();
      if (data) {
        modalType.value = 'edit';
        if (!data.tag) {
          data.tag = [];
        }
        Form.value = { ...data };
        Form.value.tag = [...data.tag];
        Form.value.role_id_list = data?.roles.map((item) => {
          return item.id;
        });
        delete Form.value.password;
      } else {
        modalType.value = 'add';
      }
      getCompanyListApi({
        page_index: 1,
        page_size: 999,
      }).then((res) => {
        companyList.value = res.data;
      });
      getRoleListApi({
        page_index: 1,
        page_size: 999,
      }).then((res) => {
        roleList.value = res.data;
      });
    }
  },
});
</script>

<template>
  <Modal
    :centered="true"
    :title="
      modalType === 'add'
        ? $t('page.user.add-title')
        : $t('page.user.edit-title')
    "
    class="w-[50%]"
  >
    <el-form
      ref="FormRef"
      :model="Form"
      :rules="rules"
      :size="formSize"
      label-width="auto"
      status-icon
    >
      <el-form-item :label="$t('page.user.name')" prop="name">
        <el-input v-model="Form.name" />
      </el-form-item>
      <el-form-item :label="$t('page.user.alias')" prop="alias">
        <el-input v-model="Form.alias" />
      </el-form-item>
      <el-form-item :label="$t('page.user.by_org')" prop="organization_id">
        <el-select v-model="Form.organization_id">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('page.user.by_role')" prop="role_id_list">
        <el-select v-model="Form.role_id_list" multiple>
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('page.user.is_leader')" prop="is_leader">
        <el-radio-group v-model="Form.is_leader">
          <el-radio :value="0">{{ $t('common.no') }}</el-radio>
          <el-radio :value="1">{{ $t('common.yes') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('common.gender')" prop="gender">
        <el-radio-group v-model="Form.gender">
          <el-radio value="男">{{ $t('common.man') }}</el-radio>
          <el-radio value="女">{{ $t('common.women') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="modalType === 'add'"
        :label="$t('common.password')"
        prop="password"
      >
        <el-input v-model="Form.password" show-password type="password" />
      </el-form-item>
      <el-form-item :label="$t('common.mobile')" prop="mobile">
        <el-input v-model="Form.mobile" />
      </el-form-item>
      <el-form-item :label="$t('common.email')" prop="email">
        <el-input v-model="Form.email" />
      </el-form-item>
      <el-form-item :label="$t('common.tag')" prop="tag">
        <mixDynamisTags v-model="Form.tag" />
      </el-form-item>

      <el-form-item :label="$t('common.description')" prop="description">
        <el-input v-model="Form.description" :rows="5" type="textarea" />
      </el-form-item>
    </el-form>
  </Modal>
</template>
