import { api } from './api.js'

export const userService = {
  async list() { const { data } = await api.get('/api/users'); return data },
  async create(request) { const { data } = await api.post('/api/users', request); return data },
  async setEnabled(id, enabled) { const { data } = await api.patch(`/api/users/${id}/status`, null, { params: { enabled } }); return data },
  async softDelete(id) { await api.delete(`/api/users/${id}`) },
}
