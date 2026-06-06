import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getGameAccountPage,
  getGameAccountDetail,
  createGameAccount,
  updateGameAccount,
  deleteGameAccount,
} from '@/api/gameAccount'

export const useGameAccountStore = defineStore('gameAccount', () => {
  const loading = ref(false)
  const pageData = ref({ current: 1, size: 10, pages: 0, records: [] })

  async function fetchPage(params = {}) {
    loading.value = true
    try {
      pageData.value = await getGameAccountPage({ current: 1, size: 10, ...params })
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id) {
    return getGameAccountDetail(id)
  }

  async function create(data) {
    await createGameAccount(data)
  }

  async function modify(data) {
    await updateGameAccount(data)
  }

  async function remove(id) {
    await deleteGameAccount(id)
  }

  return { loading, pageData, fetchPage, fetchDetail, create, modify, remove }
})
