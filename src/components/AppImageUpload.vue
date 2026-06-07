<template>
  <a-upload
    v-model:fileList="fileList"
    list-type="picture-card"
    :custom-request="customRequest"
    :before-upload="beforeUpload"
    :accept="accept"
  >
    <div v-if="showUploadBtn">
      <plus-outlined />
      <div style="margin-top: 8px">上传</div>
    </div>
  </a-upload>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { uploadImage } from '@/api/oss'
import { message } from 'ant-design-vue'

const props = defineProps({
  modelValue: { type: [String, Array], default: () => [] },
  maxCount: { type: Number, default: 9 },
  single: { type: Boolean, default: false },
  accept: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const fileList = ref([])

const max = computed(() => (props.single ? 1 : props.maxCount))
const showUploadBtn = computed(() => fileList.value.length < max.value)

// 从外部初始化 fileList
watch(() => props.modelValue, (val) => {
  if (props.single) {
    // 单图模式：modelValue 是字符串
    if (!val) {
      fileList.value = []
      return
    }
    fileList.value = [{
      uid: '-1',
      name: val.split('/').pop() || 'image.jpg',
      status: 'done',
      url: val,
    }]
  } else {
    // 多图模式：modelValue 是数组
    const urls = val || []
    if (!Array.isArray(urls)) {
      fileList.value = []
      return
    }
    fileList.value = urls.map((url, idx) => ({
      uid: `-${idx}`,
      name: url.split('/').pop() || `image-${idx}.jpg`,
      status: 'done',
      url,
    }))
  }
}, { immediate: true })

// fileList 变化时同步给父组件
watch(fileList, (list) => {
  const urls = list
    .filter(f => f.status === 'done')
    .map(f => f.url || f.response)
    .filter(Boolean)

  let nextValue
  if (props.single) {
    nextValue = urls[0] || ''
  } else {
    nextValue = urls
  }

  // 值相同时不触发更新，避免循环
  const current = JSON.stringify(props.modelValue || (props.single ? '' : []))
  const next = JSON.stringify(nextValue)
  if (current !== next) {
    emit('update:modelValue', nextValue)
  }
}, { deep: true })

function beforeUpload(file) {
  // 类型校验：有 accept 按 accept 限制，无则默认只允许图片
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map(t => t.trim()).filter(Boolean)
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'))
      }
      return file.type === type
    })
    if (!isAccepted) {
      message.error(`只允许上传 ${props.accept} 格式的文件`)
      return false
    }
  } else {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件')
      return false
    }
  }

  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('文件大小不能超过 5MB')
    return false
  }
  return true
}

async function customRequest({ file, onSuccess, onError }) {
  try {
    const url = await uploadImage(file)
    onSuccess(url)
  } catch (error) {
    onError(error)
    message.error('上传失败')
  }
}
</script>
