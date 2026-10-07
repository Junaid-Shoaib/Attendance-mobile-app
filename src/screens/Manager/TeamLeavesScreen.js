import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getTeamLeaves, reviewLeaveAsManager } from '../../services/leaveService';
import { formatDate } from '../../utils/dateUtils';
import { LEAVE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function TeamLeavesScreen() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTeamLeaves({ status: 'pending', per_page: 30 });
      setLeaves(result.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleReview = async (id, action) => {
    try {
      await reviewLeaveAsManager(id, action, action === 'approve' ? 'Approved' : 'Not approved at this time');
      Toast.show({ type: 'success', text1: `Leave ${action}d` });
      load();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Action failed', text2: err.message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.heading}>Pending Approvals</Text>
      <FlatList
        data={leaves}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No pending leave requests.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.user?.name}</Text>
              <StatusBadge status={item.status} colorMap={LEAVE_STATUS_COLORS} />
            </View>
            <Text style={styles.type}>{item.leave_type?.name}</Text>
            <Text style={styles.dates}>
              {formatDate(item.start_date)} → {formatDate(item.end_date)} ({item.total_days} days)
            </Text>
            <Text style={styles.reason}>{item.reason}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReview(item.id, 'reject')}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={() => handleReview(item.id, 'approve')}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '700', color: COLORS.text, margin: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16 },
  card: { marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontWeight: '700', color: COLORS.text },
  type: { color: COLORS.primary, fontWeight: '600', fontSize: 13, marginBottom: 2 },
  dates: { fontSize: 12, color: COLORS.muted, marginBottom: 6 },
  reason: { fontSize: 13, color: COLORS.text, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.danger, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  rejectText: { color: COLORS.danger, fontWeight: '700' },
  approveBtn: { flex: 1, backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  approveText: { color: '#fff', fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
