import axios from 'axios'

const credentialsStorageKey = 'al-shifa-basic-auth'

function loadStoredCredentials() {
  try {
    const saved = localStorage.getItem(credentialsStorageKey)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

let credentials = loadStoredCredentials()
export const hasCredentials = () => Boolean(credentials?.username && credentials?.password)
export const setCredentials = value => {
  credentials = value
  try {
    if (value) localStorage.setItem(credentialsStorageKey, JSON.stringify(value))
    else localStorage.removeItem(credentialsStorageKey)
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}
export const clearCredentials = () => setCredentials(null)

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(config => {
  if (credentials) config.auth = credentials
  return config
})

export class ApiError extends Error {
  constructor(message, status, details) { super(message); this.name = 'ApiError'; this.status = status; this.details = details }
}

export function getApiError(error) {
  if (!error.response) {
    const message = error.code === 'ECONNABORTED'
      ? 'The clinic server took too long to respond. Please try again.'
      : 'Could not reach the clinic server. Check your connection and backend CORS configuration.'
    return new ApiError(message)
  }
  const { status, data } = error.response
  const fieldErrors = data?.errors ? Object.values(data.errors).join(' ') : ''
  const message = fieldErrors || data?.message || data?.detail || (status === 401
    ? 'Email or password is incorrect.'
    : status === 403
      ? 'Your account does not have permission to do that.'
      : status === 404
        ? 'The requested item could not be found.'
        : `The request failed (${status}). Please try again.`)
  return new ApiError(message, status, data)
}

api.interceptors.response.use(response => response, error => Promise.reject(getApiError(error)))
