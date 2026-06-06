import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getGameDictionaryPage,
  getGameDictionaryPicker,
  getGameDictionaryDetail,
  createGameDictionary,
  updateGameDictionary,
  deleteGameDictionary,
} from '@/api/gameDictionary'

export const useGameDictionaryStore = defineStore('gameDictionary', () => {
  const loading = ref(false)
  const pageData = ref({ current: 1, size: 10, pages: 0, records: [] })
  const pickerData = ref([])
  const dictMap = ref({})

  async function fetchPage(params = {}) {
    loading.value = true
    try {
      pageData.value = await getGameDictionaryPage({ current: 1, size: 10, ...params })
    } finally {
      loading.value = false
    }
  }

  async function fetchPicker(params) {
    const res = await getGameDictionaryPicker({ current: 1, size: 999, ...params })
    pickerData.value = res.records || []
    return pickerData.value
  }

  async function fetchDictByType(gameId, dictType) {
    const key = `${gameId}_${dictType}`
    if (dictMap.value[key]) {
      return dictMap.value[key]
    }
    const res = await getGameDictionaryPicker({
      gameId: String(gameId),
      gameDictionary: dictType,
      current: 1,
      size: 999,
    })
    const list = res.records || []
    dictMap.value[key] = list
    return list
  }

  function clearDictCache() {
    dictMap.value = {}
  }

  async function fetchDetail(id) {
    return getGameDictionaryDetail(id)
  }

  async function create(data) {
    await createGameDictionary(data)
  }

  async function modify(data) {
    await updateGameDictionary(data)
  }

  async function remove(id) {
    await deleteGameDictionary(id)
  }

  return { loading, pageData, pickerData, dictMap, fetchPage, fetchPicker, fetchDictByType, clearDictCache, fetchDetail, create, modify, remove }
})
