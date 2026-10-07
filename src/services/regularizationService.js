import api from './api';

export async function applyRegularization({ attendance_date, requested_time_in, requested_time_out, reason, attachmentUri }) {
  const form = new FormData();
  form.append('attendance_date', attendance_date);
  if (requested_time_in) form.append('requested_time_in', requested_time_in);
  if (requested_time_out) form.append('requested_time_out', requested_time_out);
  form.append('reason', reason);
  if (attachmentUri) {
    form.append('attachment', { uri: attachmentUri, name: 'attachment.jpg', type: 'image/jpeg' });
  }

  const { data } = await api.post('/regularizations', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function getMyRegularizations(params = {}) {
  const { data } = await api.get('/regularizations', { params });
  return data.data;
}

export async function getPendingRegularizations(params = {}) {
  const { data } = await api.get('/manager/regularizations', { params });
  return data.data;
}

export async function reviewRegularization(id, action, remarks) {
  const { data } = await api.patch(`/manager/regularizations/${id}/review`, { action, remarks });
  return data.data;
}
