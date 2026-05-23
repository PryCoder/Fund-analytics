import axios from 'axios'
import { API_BASE_URL } from '../config'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, error.response.data)

      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          error.message = 'Invalid request. Please check your input.'
          break
        case 401:
          error.message = 'Unauthorized. Please log in.'
          break
        case 403:
          error.message = 'Access forbidden.'
          break
        case 404:
          error.message = 'Requested data not found.'
          break
        case 409:
          error.message = error.response.data.error || 'Duplicate entry.'
          break
        case 429:
          error.message = 'Too many requests. Please wait a moment.'
          break
        case 500:
          error.message = 'Server error. Please try again later.'
          break
        default:
          error.message = error.response.data.error || 'An error occurred.'
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request)
      error.message = 'Network error. Please check your connection.'
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  },
)

// Watchlist API endpoints
export const watchlistAPI = {
  getAll: () => api.get('/watchlist'),
  add: (schemeCode, schemeName) => api.post('/watchlist', { schemeCode, schemeName }),
  remove: (schemeCode) => api.delete(`/watchlist/${schemeCode}`),
}

// Funds API endpoints
export const fundsAPI = {
  search: (query) => api.get('/funds/search', { params: { q: query } }),
  getDetails: (schemeCode) => api.get(`/funds/${schemeCode}`),
}

export default api
