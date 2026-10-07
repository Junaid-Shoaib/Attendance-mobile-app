import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMyLeaves, cancelLeave } from '../../services/leaveService';
import { formatDate } from '../../utils/dateUtils';
import { LEAVE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function LeaveListScreen({ navigation }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMyLeaves({ per_page: 30 });
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

  const handleCancel = async (id) => {
    try {
      await cancelLeave(id);
      Toast.show({ type: 'success', text1: 'Leave request cancelled' });
      load();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Unable to cancel', text2: err.message });
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.navigate('ApplyLeave')}>
        <Icon name="plus" size={18} color="#fff" />
        <Text style={styles.applyText}>Apply for Leave</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.regBtn}
        onPress={() => navigation.navigate('Regularization')}>
        <Icon name="edit-3" size={16} color={COLORS.primary} />
        <Text style={styles.regText}>Missed Attendance? Submit a Correction</Text>
      </TouchableOpacity>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No leave requests yet.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.type}>{item.leave_type?.name}</Text>
                <StatusBadge status={item.status} colorMap={LEAVE_STATUS_COLORS} />
              </View>
              <Text style={styles.dates}>
                {formatDate(item.start_date)} → {formatDate(item.end_date)} ({item.total_days} day
                {item.total_days > 1 ? 's' : ''})
              </Text>
              <Text style={styles.reason} numberOfLines={2}>
                {item.reason}
              </Text>
              {['pending', 'manager_approved'].includes(item.status) && (
                <TouchableOpacity onPress={() => handleCancel(item.id)}>
                  <Text style={styles.cancel}>Cancel Request</Text>
                </TouchableOpacity>
              )}
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  applyBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  regBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, gap: 6 },
  regText: { color: COLORS.primary, fontWeight: '600', marginLeft: 6, fontSize: 13 },
  list: { padding: 16, paddingTop: 4 },
  card: { marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  type: { fontWeight: '700', fontSize: 15, color: COLORS.text },
  dates: { fontSize: 13, color: COLORS.muted, marginBottom: 6 },
  reason: { fontSize: 13, color: COLORS.text },
  cancel: { color: COLORS.danger, marginTop: 10, fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
