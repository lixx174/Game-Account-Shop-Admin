import request from './request'

export function getGameAccountPage(params) {
  return request.get('/game-account/page', { params })
}

export function getGameAccountDetail(id) {
  return request.get(`/game-account/${id}`)
}

export function createGameAccount(data) {
  return request.post('/game-account', data)
}

export function updateGameAccount(data) {
  return request.put('/game-account', data)
}

export function deleteGameAccount(id) {
  return request.delete(`/game-account/${id}`)
}
