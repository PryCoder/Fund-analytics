// src/services/api.js
import axios from 'axios'
import { API_BASE_URL, MFAPI_BASE_URL } from '../config'

// Backend API instance (for watchlist)
const backendApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// MFAPI instance (for fund data - direct calls, no backend proxy needed)
const mfApi = axios.create({
  baseURL: MFAPI_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
backendApi.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data)

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
      console.error('Network error:', error.request)
      error.message = 'Network error. Please check your connection.'
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  },
)

// Watchlist API (uses your Render backend)
export const watchlistAPI = {
  getAll: () => backendApi.get('/watchlist'),
  add: (schemeCode, schemeName) => backendApi.post('/watchlist', { schemeCode, schemeName }),
  remove: (schemeCode) => backendApi.delete(`/watchlist/${schemeCode}`),
}

// Funds API (uses MFAPI directly - no backend needed)
export const fundsAPI = {
  search: (query) => mfApi.get('/search', { params: { q: query } }),
  getDetails: (schemeCode) => mfApi.get(`/${schemeCode}`),
}

export default backendApi