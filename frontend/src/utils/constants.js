export const TIME_RANGES = {
  '1Y': 365,
  '3Y': 1095,
  '5Y': 1825,
  'ALL': null
};

export const API_CONFIG = {
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Requested data not found.',
  DUPLICATE: 'Scheme already exists in watchlist.',
  VALIDATION: 'Please check your input and try again.'
};