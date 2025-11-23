<script lang="ts" setup>
import type { SchedulerJob } from '#/api/core/scheduler';

import { computed, ref, watch } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { ElButton } from 'element-plus';

import { createSchedulerJobApi, updateSchedulerJobApi } from '#/api/core/scheduler';
import { useJobFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SchedulerJob>();
const triggerType = ref<'cron' | 'interval' | 'date'>('cron');

const getTitle = computed(() => {
  return formData.value?.id
    ? `编辑定时任务`
    : `创建定时任务`;
});

// 根据当前的 trigger_type 动态生成表单配置
const formSchema = computed(() => useJobFormSchema(triggerType.value) as any);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: formSchema as any,
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

/**
 * 处理触发器类型变更
 */
function handleTriggerTypeChange(value: string) {
  triggerType.value = value as 'cron' | 'interval' | 'date';
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await (formData.value?.id
          ? updateSchedulerJobApi(formData.value.id, data as any)
          : createSchedulerJobApi(data as any));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SchedulerJob>();
      if (data) {
        formData.value = data;
        triggerType.value = data.trigger_type;
        formApi.setValues(formData.value);
      } else {
        formData.value = undefined;
        triggerType.value = 'cron';
        formApi.resetForm();
      }
    }
  },
});

// 监听trigger_type变更时重新渲染表单
watch(
  () => triggerType.value,
  () => {
    // 触发表单重新渲染
  },
);
</script>

<template>
  <Modal :title="getTitle" class="w-[800px]">
    <Form class="mx-4" @trigger-type-change="handleTriggerTypeChange" />
    <template #prepend-footer>
      <div class="flex-auto">
        <ElButton @click="resetForm">
          {{ $t('common.reset') || '重置' }}
        </ElButton>
      </div>
    </template>
  </Modal>
</template>

