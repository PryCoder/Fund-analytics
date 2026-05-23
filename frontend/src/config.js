
const getApiBaseUrl = () => {
  // Production - use your Render backend
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://fund-analytics-44mj.onrender.com/api';
  }
  
  // Development - local backend
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

