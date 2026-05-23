const getApiBaseUrl = () => {
  // Production
  if (import.meta.env.MODE === 'production') {
    return (
      import.meta.env.VITE_API_URL ||
      'https://fund-analytics-44mj.onrender.com/api'
    );
  }

  // Development
  return (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  );
};

export const API_BASE_URL = getApiBaseUrl();

console.log('API BASE URL:', API_BASE_URL);