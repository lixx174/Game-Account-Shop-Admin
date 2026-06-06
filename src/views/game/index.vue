<template>
  <div>
    <a-form layout="inline" style="margin-bottom: 16px">
      <a-form-item label="游戏名称">
        <a-input v-model:value="query.name" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-form-item>
    </a-form>

    <a-button type="primary" style="margin-bottom: 16px" @click="onAdd">新增游戏</a-button>

    <AppTable
      :columns="columns"
      :data-source="store.pageData.records"
      :loading="store.loading"
      :pagination="pagination"
      @change="onPageChange"
      @edit="onEdit"
      @delete="onDelete"
    />

    <AppFormModal
      :open="modalOpen"
      :title="modalTitle"
      :loading="modalLoading"
      :initial-values="formData"
      :rules="rules"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <a-form-item label="游戏名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入游戏名称" />
      </a-form-item>
      <a-form-item label="图标地址" name="icon">
        <a-input v-model:value="formData.icon" placeholder="请输入图标地址" />
      </a-form-item>
    </AppFormModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useGameStore } from '@/stores/game'
import AppTable from '@/components/AppTable.vue'
import AppFormModal from '@/components/AppFormModal.vue'

const store = useGameStore()
const query = reactive({ name: '' })
const modalOpen = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const formData = reactive({ id: null, name: '', icon: '' })

const modalTitle = computed(() => (isEdit.value ? '编辑游戏' : '新增游戏'))

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '游戏名称', dataIndex: 'name' },
  { title: '图标地址', dataIndex: 'icon', ellipsis: true },
  { title: '创建时间', dataIndex: 'createAt', width: 180 },
  { title: '操作', key: 'action', width: 160 },
]

const pagination = computed(() => ({
  current: store.pageData.current || 1,
  pageSize: store.pageData.size || 10,
  total: (store.pageData.pages || 0) * (store.pageData.size || 10),
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
}))

onMounted(() => {
  store.fetchPage()
})

function onSearch() {
  store.fetchPage({ ...query, current: 1 })
}

function onReset() {
  query.name = ''
  store.fetchPage({ current: 1 })
}

function onPageChange(p) {
  store.fetchPage({ ...query, current: p.current, size: p.pageSize })
}

function onAdd() {
  isEdit.value = false
  Object.assign(formData, { id: null, name: '', icon: '' })
  modalOpen.value = true
}

function onEdit(record) {
  isEdit.value = true
  Object.assign(formData, { ...record })
  modalOpen.value = true
}

async function onDelete(id) {
  await store.remove(id)
  message.success('删除成功')
  store.fetchPage({ ...query })
}

const rules = {
  name: [{ required: true, message: '请输入游戏名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标地址', trigger: 'blur' }],
}

async function onModalOk(values) {
  modalLoading.value = true
  try {
    if (isEdit.value) {
      await store.modify(values)
      message.success('修改成功')
    } else {
      await store.create(values)
      message.success('新增成功')
    }
    modalOpen.value = false
    store.fetchPage({ ...query })
  } finally {
    modalLoading.value = false
  }
}

function onModalCancel() {
  modalOpen.value = false
}
</script>
