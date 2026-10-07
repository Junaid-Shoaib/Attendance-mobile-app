import api from './api';

export async function getProfile() {
  const { data } = await api.get('/profile');
  return data.data;
}

export async function updateProfile(payload) {
  const { data } = await api.put('/profile', payload);
  return data.data;
}

export async function updateAvatar(uri) {
  const form = new FormData();
  form.append('avatar', { uri, name: 'avatar.jpg', type: 'image/jpeg' });

  const { data } = await api.post('/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function registerFcmToken(fcm_token, device_id, platform) {
  const { data } = await api.post('/profile/fcm-token', { fcm_token, device_id, platform });
  return data;
}
