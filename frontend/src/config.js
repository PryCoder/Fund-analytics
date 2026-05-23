// Configuration for different environments
// This file replaces .env approach to avoid process is not defined error

const config = {
  development: {
    API_URL: 'http://localhost:5000/api'
  },
  production: {
    API_URL: 'https://your-backend-url.onrender.com/api' // Replace with your deployed backend URL
  }
};

// Determine current environment
// In Create React App, NODE_ENV is set automatically during build
const environment = process.env.NODE_ENV || 'development';

// Export configuration
export const API_CONFIG = config[environment];

// Export API URL directly for convenience
export const API_BASE_URL = API_CONFIG.API_URL;

// Log which environment is being used (helpful for debugging)
console.log(`🔧 Running in ${environment} mode, API URL: ${API_BASE_URL}`);