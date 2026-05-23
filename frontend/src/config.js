const config = {
  development: {
    API_URL: 'http://localhost:5000/api',
  },

  production: {
    API_URL: import.meta.env.VITE_API_BASE_URL,
  },
}

// Current environment
const environment =
  import.meta.env.MODE || 'development'

// Export config
export const API_CONFIG =
  config[environment] || config.development

export const API_BASE_URL =
  API_CONFIG.API_URL

console.log(
  `🔧 Running in ${environment} mode, API URL: ${API_BASE_URL}`
)