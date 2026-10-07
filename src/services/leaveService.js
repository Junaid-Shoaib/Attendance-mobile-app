import api from './api';

export async function getLeaveTypes() {
  const { data } = await api.get('/leaves/types');
  return data.data;
}

export async function getLeaveBalance() {
  const { data } = await api.get('/leaves/balance');
  return data.data;
}

export async function getMyLeaves(params = {}) {
  const { data } = await api.get('/leaves', { params });
  return data.data;
}

export async function applyLeave({ leave_type_id, start_date, end_date, reason, attachmentUri }) {
  const form = new FormData();
  form.append('leave_type_id', String(leave_type_id));
  form.append('start_date', start_date);
  form.append('end_date', end_date);
  form.append('reason', reason);
  if (attachmentUri) {
    form.append('attachment', { uri: attachmentUri, name: 'attachment.jpg', type: 'image/jpeg' });
  }

  const { data } = await api.post('/leaves', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function cancelLeave(leaveId) {
  const { data } = await api.patch(`/leaves/${leaveId}/cancel`);
  return data.data;
}

// --- Manager ---
export async function getTeamLeaves(params = {}) {
  const { data } = await api.get('/manager/leaves', { params });
  return data.data;
}

export async function reviewLeaveAsManager(leaveId, action, remarks) {
  const { data } = await api.patch(`/manager/leaves/${leaveId}/review`, { action, remarks });
  return data.data;
}

// --- Admin ---
export async function getAllLeaves(params = {}) {
  const { data } = await api.get('/admin/leaves', { params });
  return data.data;
}

export async function reviewLeaveAsAdmin(leaveId, action, remarks) {
  const { data } = await api.patch(`/admin/leaves/${leaveId}/review`, { action, remarks });
  return data.data;
}
