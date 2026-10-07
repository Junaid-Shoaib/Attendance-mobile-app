import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceContext } from '../utils/deviceUtils';

export async function login(email, password, fcmToken) {
  const device = await getDeviceContext();

  const { data } = await api.post('/auth/login', {
    email,
    password,
    fcm_token: fcmToken,
    ...device,
  });

  await AsyncStorage.setItem('auth_token', data.data.token);
  await AsyncStorage.setItem('auth_user', JSON.stringify(data.data.user));

  return data.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
  }
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data.data;
}

export async function changePassword(current_password, new_password, new_password_confirmation) {
  const { data } = await api.post('/auth/change-password', {
    current_password,
    new_password,
    new_password_confirmation,
  });
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}
