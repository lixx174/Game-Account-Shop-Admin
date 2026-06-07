<template>
  <a-modal
    :open="open"
    :title="title"
    :confirm-loading="loading"
    @ok="onOk"
    @cancel="onCancel"
    destroy-on-close
    :width="width"
  >
    <a-form
      ref="formRef"
      :model="props.initialValues"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <slot />
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  initialValues: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  width: { type: Number, default: 600 },
})

const emit = defineEmits(['ok', 'cancel'])

const formRef = ref()

watch(
  () => props.open,
  (val) => {
    if (!val) {
      formRef.value?.resetFields()
    }
  }
)

async function onOk() {
  try {
    await formRef.value.validate()
    emit('ok', { ...props.initialValues })
  } catch (error) {
    console.log('Validation failed', error)
    // 校验失败不处理
  }
}

function onCancel() {
  emit('cancel')
}

defineExpose({ resetFields: () => formRef.value?.resetFields() })
</script>
