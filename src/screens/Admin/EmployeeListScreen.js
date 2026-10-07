import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { listUsers, disableUser, enableUser } from '../../services/userService';
import { COLORS } from '../../utils/constants';

export default function EmployeeListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const result = await listUsers({ search: q, per_page: 50 });
      setEmployees(result.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(search);
    }, [load])
  );

  const toggleStatus = async (emp) => {
    try {
      if (emp.status === 'active') {
        await disableUser(emp.id);
      } else {
        await enableUser(emp.id);
      }
      Toast.show({ type: 'success', text1: 'Status updated' });
      load(search);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: err.message });
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <Input
          placeholder="Search by name, email, ID..."
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            load(t);
          }}
          style={styles.search}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('EmployeeForm')}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EmployeeForm', { employee: item })}>
              <Card style={styles.row}>
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.employee_id} · {item.role.replace('_', ' ')} · {item.department?.name || '—'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.statusPill, item.status === 'active' ? styles.active : styles.disabled]}
                  onPress={() => toggleStatus(item)}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </TouchableOpacity>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, gap: 10 },
  search: { flex: 1 },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  list: { padding: 16, paddingTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  name: { fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 4, textTransform: 'capitalize' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  active: { backgroundColor: '#DCFCE7' },
  disabled: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
