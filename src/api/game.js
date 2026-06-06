import request from './request'

export function getGamePage(params) {
  return request.get('/game/page', { params })
}

export function getGameDetail(id) {
  return request.get(`/game/${id}`)
}

export function createGame(data) {
  return request.post('/game', data)
}

export function updateGame(data) {
  return request.put('/game', data)
}

export function deleteGame(id) {
  return request.delete(`/game/${id}`)
}
