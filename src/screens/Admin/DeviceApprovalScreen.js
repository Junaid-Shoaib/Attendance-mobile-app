import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPendingDevices, approveDevice } from '../../services/userService';
import { COLORS } from '../../utils/constants';

export default function DeviceApprovalScreen() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPendingDevices();
      setDevices(result.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleApprove = async (id) => {
    try {
      await approveDevice(id);
      Toast.show({ type: 'success', text1: 'Device approved' });
      load();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Approval failed', text2: err.message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.heading}>Pending Device Approvals</Text>
      <Text style={styles.subheading}>
        New devices must be approved before an employee can log in or mark attendance from them.
      </Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No devices awaiting approval.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.name}>{item.user?.name}</Text>
            <Text style={styles.meta}>{item.device_name} · {item.platform} {item.os_version}</Text>
            <Text style={styles.meta}>App v{item.app_version}</Text>
            {item.is_rooted_or_jailbroken && (
              <Text style={styles.warning}>⚠ This device reports as rooted/jailbroken</Text>
            )}
            <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
              <Text style={styles.approveText}>Approve Device</Text>
            </TouchableOpacity>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '700', color: COLORS.text, margin: 16, marginBottom: 4 },
  subheading: { fontSize: 12, color: COLORS.muted, marginHorizontal: 16, marginBottom: 12 },
  list: { paddingHorizontal: 16 },
  card: { marginBottom: 12 },
  name: { fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  warning: { fontSize: 12, color: COLORS.danger, marginTop: 8, fontWeight: '600' },
  approveBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  approveText: { color: '#fff', fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
