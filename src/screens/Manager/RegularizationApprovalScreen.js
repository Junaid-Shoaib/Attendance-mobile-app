import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPendingRegularizations, reviewRegularization } from '../../services/regularizationService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { COLORS } from '../../utils/constants';

export default function RegularizationApprovalScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPendingRegularizations({ per_page: 30 });
      setItems(result.data || []);
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
      await reviewRegularization(id, action, action === 'approve' ? 'Verified and approved' : 'Rejected');
      Toast.show({ type: 'success', text1: `Request ${action}d` });
      load();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Action failed', text2: err.message });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.heading}>Pending Attendance Corrections</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nothing to review.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.name}>{item.user?.name}</Text>
            <Text style={styles.date}>{formatDate(item.attendance_date)}</Text>
            <Text style={styles.requested}>
              Requested In: {formatTime(item.requested_time_in)} · Out: {formatTime(item.requested_time_out)}
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
  name: { fontWeight: '700', color: COLORS.text },
  date: { color: COLORS.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  requested: { color: COLORS.muted, fontSize: 12, marginTop: 6 },
  reason: { color: COLORS.text, fontSize: 13, marginTop: 6, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.danger, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  rejectText: { color: COLORS.danger, fontWeight: '700' },
  approveBtn: { flex: 1, backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  approveText: { color: '#fff', fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
