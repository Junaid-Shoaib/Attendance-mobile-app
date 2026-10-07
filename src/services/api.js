import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator uses 10.0.2.2 to reach the host machine's localhost.
// iOS simulator can use localhost directly. Update for a real device / staging / prod.
export const API_BASE_URL = 'http://192.168.100.233:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

// Attach the Sanctum bearer token to every request.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401/403 handling: clear session on auth failure so the app can
// redirect back to the login screen.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    }
    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error) {
  const response = error.response;
  return {
    status: response?.status ?? 0,
    message: response?.data?.message ?? error.message ?? 'Network error. Please try again.',
    errors: response?.data?.errors ?? null,
  };
}

export default api;
