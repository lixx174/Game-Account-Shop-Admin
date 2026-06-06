import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGamePage, getGameDetail, createGame, updateGame, deleteGame } from '@/api/game'

export const useGameStore = defineStore('game', () => {
  const loading = ref(false)
  const pageData = ref({ current: 1, size: 10, pages: 0, records: [] })

  async function fetchPage(params = {}) {
    loading.value = true
    try {
      pageData.value = await getGamePage({ current: 1, size: 10, ...params })
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id) {
    return getGameDetail(id)
  }

  async function create(data) {
    await createGame(data)
  }

  async function modify(data) {
    await updateGame(data)
  }

  async function remove(id) {
    await deleteGame(id)
  }

  return { loading, pageData, fetchPage, fetchDetail, create, modify, remove }
})
