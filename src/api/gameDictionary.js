import request from './request'

export function getGameDictionaryPage(params) {
  return request.get('/game-dictionary/page', { params })
}

export function getGameDictionaryPicker(params) {
  return request.get('/game-dictionary/picker', { params })
}

export function getGameDictionaryDetail(id) {
  return request.get(`/game-dictionary/${id}`)
}

export function createGameDictionary(data) {
  return request.post('/game-dictionary', data)
}

export function updateGameDictionary(data) {
  return request.put('/game-dictionary', data)
}

export function deleteGameDictionary(id) {
  return request.delete(`/game-dictionary/${id}`)
}
