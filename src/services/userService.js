import api from './api';

export async function listUsers(params = {}) {
  const { data } = await api.get('/admin/users', { params });
  return data.data;
}

export async function createUser(payload) {
  const { data } = await api.post('/admin/users', payload);
  return data.data;
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/admin/users/${id}`, payload);
  return data.data;
}

export async function disableUser(id) {
  const { data } = await api.patch(`/admin/users/${id}/disable`);
  return data.data;
}

export async function enableUser(id) {
  const { data } = await api.patch(`/admin/users/${id}/enable`);
  return data.data;
}

export async function getPendingDevices() {
  const { data } = await api.get('/admin/devices', { params: { status: 'pending' } });
  return data.data;
}

export async function approveDevice(id) {
  const { data } = await api.patch(`/admin/devices/${id}/approve`);
  return data.data;
}
