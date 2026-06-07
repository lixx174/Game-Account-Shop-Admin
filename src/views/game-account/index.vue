<template>
  <div>
    <a-form layout="inline" style="margin-bottom: 16px">
      <a-form-item label="游戏" required>
        <a-select
          v-model:value="query.gameId"
          placeholder="请选择游戏"
          style="width: 180px"
          :options="gameOptions"
          @change="onGameChange"
        />
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model:value="query.title" placeholder="请输入标题" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-form-item>
    </a-form>

    <a-button type="primary" style="margin-bottom: 16px" :disabled="!query.gameId" @click="onAdd">新增账号</a-button>

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
      :width="700"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <a-form-item label="所属游戏" name="gameId">
        <a-select v-model:value="formData.gameId" placeholder="请选择游戏" :options="gameOptions" />
      </a-form-item>
      <a-form-item label="标题" name="title">
        <a-input v-model:value="formData.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item label="账号来源" name="originId">
        <a-select v-model:value="formData.originId" placeholder="请选择来源" :options="originOptions" />
      </a-form-item>
      <a-form-item label="游戏区服" name="serverId">
        <a-select v-model:value="formData.serverId" placeholder="请选择区服" :options="serverOptions" />
      </a-form-item>
      <a-form-item label="游戏系统" name="systemId">
        <a-select v-model:value="formData.systemId" placeholder="请选择系统" :options="systemOptions" />
      </a-form-item>
      <a-form-item label="账号标签" name="tagIds">
        <a-select v-model:value="formData.tagIds" mode="multiple" placeholder="请选择标签" :options="tagOptions" />
      </a-form-item>
      <a-form-item label="价格" name="price">
        <a-input-number v-model:value="formData.price" style="width: 100%" :min="0" :precision="2" placeholder="请输入价格" />
      </a-form-item>
      <a-form-item label="账号截图" name="images">
        <AppImageUpload v-model:model-value="formData.images" :max-count="9" accept="image/png,image/jpeg,image/gif,image/webp" />
      </a-form-item>
      <a-form-item label="流程" name="process">
        <a-textarea v-model:value="formData.process" placeholder="请输入流程" :rows="2" />
      </a-form-item>
      <a-form-item label="政策" name="policy">
        <a-textarea v-model:value="formData.policy" placeholder="请输入政策" :rows="2" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formData.remark" placeholder="请输入备注" :rows="3" />
      </a-form-item>
    </AppFormModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useGameAccountStore } from '@/stores/gameAccount'
import { useGameStore } from '@/stores/game'
import { useGameDictionaryStore } from '@/stores/gameDictionary'
import AppTable from '@/components/AppTable.vue'
import AppFormModal from '@/components/AppFormModal.vue'
import AppImageUpload from '@/components/AppImageUpload.vue'

const store = useGameAccountStore()
const gameStore = useGameStore()
const dictStore = useGameDictionaryStore()

const query = reactive({ gameId: undefined, title: '' })
const modalOpen = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: null, gameId: undefined, title: '', originId: undefined,
  serverId: undefined, systemId: undefined, tagIds: [],
  price: 0, images: [], process: '', policy: '', remark: '',
})
const modalTitle = computed(() => (isEdit.value ? '编辑账号' : '新增账号'))

const gameOptions = computed(() =>
  (gameStore.pageData.records || []).map((g) => ({ label: g.name, value: g.id }))
)

function getDictOptions(dictType) {
  if (!formData.gameId) return []
  const key = `${formData.gameId}_${dictType}`
  const list = dictStore.dictMap[key] || []
  return list.map((d) => ({ label: d.name, value: d.id }))
}

const originOptions = computed(() => getDictOptions('ACCOUNT_ORIGIN'))
const serverOptions = computed(() => getDictOptions('GAME_SERVER'))
const systemOptions = computed(() => getDictOptions('GAME_SYSTEM'))
const tagOptions = computed(() => getDictOptions('ACCOUNT_TAG'))

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '标题', dataIndex: 'title' },
  { title: '来源', dataIndex: 'originName', width: 120 },
  { title: '区服', dataIndex: 'serverName', width: 120 },
  { title: '系统', dataIndex: 'systemName', width: 100 },
  { title: '标签', dataIndex: 'tags', width: 150, customRender: ({ text }) => text?.join(', ') || '-' },
  { title: '价格', dataIndex: 'price', width: 100 },
  { title: '流程', dataIndex: 'process', ellipsis: true, width: 120 },
  { title: '政策', dataIndex: 'policy', ellipsis: true, width: 120 },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
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

onMounted(async () => {
  await gameStore.fetchPage({ size: 999 })
  if (gameOptions.value.length > 0) {
    query.gameId = gameOptions.value[0].value
    await loadDictionaryData()
    store.fetchPage({ ...query })
  }
})

async function loadDictionaryData() {
  if (!query.gameId) return
  await Promise.all([
    dictStore.fetchDictByType(query.gameId, 'ACCOUNT_ORIGIN'),
    dictStore.fetchDictByType(query.gameId, 'GAME_SERVER'),
    dictStore.fetchDictByType(query.gameId, 'GAME_SYSTEM'),
    dictStore.fetchDictByType(query.gameId, 'ACCOUNT_TAG'),
  ])
}

watch(() => formData.gameId, async (val) => {
  if (val && modalOpen.value) {
    formData.originId = undefined
    formData.serverId = undefined
    formData.systemId = undefined
    formData.tagIds = []
    await Promise.all([
      dictStore.fetchDictByType(val, 'ACCOUNT_ORIGIN'),
      dictStore.fetchDictByType(val, 'GAME_SERVER'),
      dictStore.fetchDictByType(val, 'GAME_SYSTEM'),
      dictStore.fetchDictByType(val, 'ACCOUNT_TAG'),
    ])
  }
})

async function onGameChange() {
  await loadDictionaryData()
  store.fetchPage({ ...query, current: 1 })
}

function onSearch() {
  store.fetchPage({ ...query, current: 1 })
}

function onReset() {
  query.title = ''
  if (gameOptions.value.length > 0) {
    query.gameId = gameOptions.value[0].value
  }
  store.fetchPage({ ...query, current: 1 })
}

function onPageChange(p) {
  store.fetchPage({ ...query, current: p.current, size: p.pageSize })
}

async function onAdd() {
  isEdit.value = false
  Object.assign(formData, {
    id: null, gameId: query.gameId, title: '', originId: undefined,
    serverId: undefined, systemId: undefined, tagIds: [],
    price: 0, images: [], process: '', policy: '', remark: '',
  })
  await loadDictionaryData()
  modalOpen.value = true
}

async function onEdit(record) {
  isEdit.value = true
  const detail = await store.fetchDetail(record.id)
  Object.assign(formData, {
    id: detail.id,
    gameId: query.gameId,
    title: detail.title,
    originId: detail.originId,
    serverId: detail.serverId,
    systemId: detail.systemId,
    tagIds: detail.tagIds || [],
    price: detail.price,
    images: detail.images || [],
    process: detail.process || '',
    policy: detail.policy || '',
    remark: detail.remark || '',
  })
  await loadDictionaryData()
  modalOpen.value = true
}

async function onDelete(id) {
  await store.remove(id)
  message.success('删除成功')
  store.fetchPage({ ...query })
}

const rules = {
  gameId: [{ required: true, message: '请选择游戏', trigger: 'change', type: 'number' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  originId: [{ required: true, message: '请选择来源', trigger: 'change', type: 'number' }],
  serverId: [{ required: true, message: '请选择区服', trigger: 'change', type: 'number' }],
  systemId: [{ required: true, message: '请选择系统', trigger: 'change', type: 'number' }],
  tagIds: [{ required: true, message: '请选择标签', trigger: 'change', type: 'array' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur', type: 'number' }],
  images: [{ required: true, message: '请添加截图', trigger: 'change', type: 'array' }],
}

async function onModalOk(values) {
  modalLoading.value = true
  try {
    const payload = { ...values }
    if (isEdit.value) {
      await store.modify({ ...payload, id: formData.id })
      message.success('修改成功')
    } else {
      await store.create(payload)
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
