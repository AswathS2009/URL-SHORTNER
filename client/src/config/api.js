// API configuration for different environments
const getApiBaseUrl = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // In production on Railway, use the backend service URL
  // Set VITE_API_BASE_URL environment variable in Railway
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback: try to construct from current domain
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};

export const API_BASE_URL = getApiBaseUrl();
