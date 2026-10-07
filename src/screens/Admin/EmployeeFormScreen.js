import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { createUser, updateUser } from '../../services/userService';
import api from '../../services/api';
import { COLORS } from '../../utils/constants';

const ROLE_OPTIONS = ['employee', 'manager', 'super_admin'];

export default function EmployeeFormScreen({ route, navigation }) {
  const employee = route.params?.employee;
  const isEdit = !!employee;

  const [form, setForm] = useState({
    employee_id: employee?.employee_id || '',
    name: employee?.name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    password: '',
    role: employee?.role || 'employee',
    joining_date: employee?.joining_date || '',
  });
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState(employee?.department_id || null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/departments').then(({ data }) => setDepartments(data.data));
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateUser(employee.id, { ...form, department_id: departmentId });
        Toast.show({ type: 'success', text1: 'Employee updated' });
      } else {
        await createUser({ ...form, department_id: departmentId });
        Toast.show({ type: 'success', text1: 'Employee created' });
      }
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Input label="Employee ID" value={form.employee_id} onChangeText={set('employee_id')} editable={!isEdit} />
      <Input label="Full Name" value={form.name} onChangeText={set('name')} />
      <Input label="Email" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Phone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
      {!isEdit && <Input label="Temporary Password" value={form.password} onChangeText={set('password')} secureTextEntry />}
      <Input label="Joining Date (YYYY-MM-DD)" value={form.joining_date} onChangeText={set('joining_date')} />

      <Text style={styles.label}>Role</Text>
      <View style={styles.chipRow}>
        {ROLE_OPTIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.chip, form.role === r && styles.chipActive]}
            onPress={() => set('role')(r)}>
            <Text style={[styles.chipText, form.role === r && styles.chipTextActive]}>{r.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Department</Text>
      <View style={styles.chipRow}>
        {departments.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.chip, departmentId === d.id && styles.chipActive]}
            onPress={() => setDepartmentId(d.id)}>
            <Text style={[styles.chipText, departmentId === d.id && styles.chipTextActive]}>{d.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title={isEdit ? 'Save Changes' : 'Create Employee'} onPress={handleSubmit} loading={submitting} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text, fontSize: 13, textTransform: 'capitalize' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});
