<template>
  <div>
    <a-form layout="inline" style="margin-bottom: 16px">
      <a-form-item label="游戏">
        <a-select
          v-model:value="query.gameId"
          placeholder="请选择游戏"
          style="width: 180px"
          allow-clear
          :options="gameOptions"
          @change="onGameChange"
        />
      </a-form-item>
      <a-form-item label="字典类型">
        <a-select
          v-model:value="query.gameDictionary"
          placeholder="请选择字典类型"
          style="width: 180px"
          :options="dictionaryTypeOptions"
        />
      </a-form-item>
      <a-form-item label="名称">
        <a-input v-model:value="query.name" placeholder="请输入" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-form-item>
    </a-form>

    <a-button type="primary" style="margin-bottom: 16px" @click="onAdd">新增字典</a-button>

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
      <a-form-item label="所属游戏" name="gameId">
        <a-select v-model:value="formData.gameId" placeholder="请选择游戏" :options="gameOptions" />
      </a-form-item>
      <a-form-item label="字典类型" name="gameDictionary">
        <a-select v-model:value="formData.gameDictionary" placeholder="请选择字典类型" :options="dictionaryTypeOptions" />
      </a-form-item>
      <a-form-item label="字典名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入字典名称" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formData.remark" placeholder="请输入备注" :rows="3" />
      </a-form-item>
    </AppFormModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useGameDictionaryStore } from '@/stores/gameDictionary'
import { useGameStore } from '@/stores/game'
import AppTable from '@/components/AppTable.vue'
import AppFormModal from '@/components/AppFormModal.vue'

const store = useGameDictionaryStore()
const gameStore = useGameStore()
const query = reactive({ gameId: undefined, gameDictionary: undefined, name: '' })
const modalOpen = ref(false)
const modalLoading = ref(false)
const isEdit = ref(false)
const formData = reactive({ id: null, gameId: undefined, gameDictionary: undefined, name: '', remark: '' })

const modalTitle = computed(() => (isEdit.value ? '编辑字典' : '新增字典'))

const dictionaryTypeOptions = [
  { label: '账号来源', value: 'ACCOUNT_ORIGIN' },
  { label: '游戏区服', value: 'GAME_SERVER' },
  { label: '游戏系统', value: 'GAME_SYSTEM' },
  { label: '账号标签', value: 'ACCOUNT_TAG' },
]

const dictionaryTypeMap = Object.fromEntries(dictionaryTypeOptions.map((o) => [o.value, o.label]))

const gameOptions = computed(() =>
  (gameStore.pageData.records || []).map((g) => ({ label: g.name, value: String(g.id) }))
)
const gameNameMap = computed(() =>
  Object.fromEntries((gameStore.pageData.records || []).map((g) => [g.name, g.id]))
)
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '游戏', dataIndex: 'gameName' },
  { title: '字典类型', dataIndex: 'gameDictionary', customRender: ({ text }) => dictionaryTypeMap[text] || text || '-' },
  { title: '名称', dataIndex: 'name' },
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
  if (!query.gameDictionary) {
    query.gameDictionary = 'ACCOUNT_ORIGIN'
  }
  store.fetchPage({ ...query })
})

function onGameChange() {
  store.fetchPage({ ...query, current: 1 })
}

function onSearch() {
  store.fetchPage({ ...query, current: 1 })
}

function onReset() {
  query.gameId = undefined
  query.gameDictionary = 'ACCOUNT_ORIGIN'
  query.name = ''
  store.fetchPage({ current: 1, gameDictionary: 'ACCOUNT_ORIGIN' })
}

function onPageChange(p) {
  store.fetchPage({ ...query, current: p.current, size: p.pageSize })
}

function onAdd() {
  isEdit.value = false
  Object.assign(formData, { id: null, gameId: query.gameId, gameDictionary: query.gameDictionary, name: '', remark: '' })
  modalOpen.value = true
}

async function onEdit(record) {
  isEdit.value = true
  const detail = await store.fetchDetail(record.id)
  Object.assign(formData, {
    id: detail.id,
    gameId: detail.gameId ? String(detail.gameId) : undefined,
    gameDictionary: detail.gameDictionary,
    name: detail.name,
    remark: detail.remark || '',
  })
  modalOpen.value = true
}

async function onDelete(id) {
  await store.remove(id)
  message.success('删除成功')
  store.fetchPage({ ...query })
}

const rules = {
  gameId: [{ required: true, message: '请选择游戏', trigger: 'change' }],
  gameDictionary: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
}

async function onModalOk(values) {
  modalLoading.value = true
  try {
    const payload = { ...values };
    console.log({ payload });
    if (isEdit.value) {
      await store.modify({ ...payload })
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
