import { api, setCredentials, clearCredentials } from './api.js'

export const authService = {
  async login(email, password) {
    const credentials = { username: email, password }
    setCredentials(credentials)
    try {
      const { data } = await api.get('/api/auth/me')
      return data
    } catch (error) {
      clearCredentials()
      throw error
    }
  },
  async currentUser() { const { data } = await api.get('/api/auth/me'); return data },
  logout() { clearCredentials() },
}
