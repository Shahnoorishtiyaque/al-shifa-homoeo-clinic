import { api } from './api.js'

export const appointmentService = {
  async create(request) { const { data } = await api.post('/api/appointments', request); return data },
  async list() { const { data } = await api.get('/api/appointments'); return data },
  async listByStatus(status) { const { data } = await api.get(`/api/appointments/status/${encodeURIComponent(status)}`); return data },
  async updateStatus(id, status) { const { data } = await api.patch(`/api/appointments/${id}/status`, { status }); return data },
  async softDelete(id) { await api.delete(`/api/appointments/${id}`) },
}
