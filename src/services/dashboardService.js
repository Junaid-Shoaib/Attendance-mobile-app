import api from './api';

export async function getEmployeeDashboard() {
  const { data } = await api.get('/employee/dashboard');
  return data.data;
}

export async function getManagerDashboard() {
  const { data } = await api.get('/manager/dashboard');
  return data.data;
}

export async function getAdminDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

export async function getTeamAttendance(date) {
  const { data } = await api.get('/manager/team-attendance', { params: { date } });
  return data.data;
}
