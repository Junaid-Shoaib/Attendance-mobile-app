import api from './api';
import { getDeviceContext } from '../utils/deviceUtils';
import { getCurrentPosition } from '../utils/locationUtils';

async function buildAttendancePayload(selfieUri) {
  const device = await getDeviceContext();
  const position = await getCurrentPosition();

  const form = new FormData();
  form.append('latitude', String(position.latitude));
  form.append('longitude', String(position.longitude));
  if (position.address) form.append('address', position.address);
  form.append('device_id', device.device_id);
  form.append('device_name', device.device_name);
  form.append('platform', device.platform);
  form.append('os_version', device.os_version);
  form.append('app_version', device.app_version);
  // form.append('is_rooted_or_jailbroken', String(device.is_rooted_or_jailbroken));
   form.append('is_rooted_or_jailbroken', device.is_rooted_or_jailbroken ? '1' : '0');
  // form.append('is_mock_location', String(position.isMock));
   form.append('is_mock_location', position.isMock ? '1' : '0');
  form.append('device_timestamp', new Date().toISOString());

  if (selfieUri) {
    form.append('selfie', { uri: selfieUri, name: 'selfie.jpg', type: 'image/jpeg' });
  }

  return form;
}

export async function timeIn(selfieUri) {
  const form = await buildAttendancePayload(selfieUri);
  const { data } = await api.post('/attendance/time-in', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function timeOut(selfieUri) {
  const form = await buildAttendancePayload(selfieUri);
  const { data } = await api.post('/attendance/time-out', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function getToday() {
  const { data } = await api.get('/attendance/today');
  return data.data;
}

export async function getHistory(params = {}) {
  const { data } = await api.get('/attendance/history', { params });
  return data.data;
}

export async function getCalendar(month, year) {
  const { data } = await api.get('/attendance/calendar', { params: { month, year } });
  return data.data;
}
