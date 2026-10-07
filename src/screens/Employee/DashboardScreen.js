import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import { fetchToday, markTimeIn, markTimeOut } from '../../store/slices/attendanceSlice';
import { getEmployeeDashboard } from '../../services/dashboardService';
import { formatTime } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { today, status } = useSelector((state) => state.attendance);
  const [summary, setSummary] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    dispatch(fetchToday());
    try {
      const data = await getEmployeeDashboard();
      setSummary(data);
    } catch (err) {
      // Silently ignore; dashboard is best-effort supplementary data.
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleTimeIn = async () => {
    const result = await dispatch(markTimeIn());
    if (markTimeIn.fulfilled.match(result)) {
      Toast.show({ type: 'success', text1: 'Time In marked successfully' });
    } else {
      Toast.show({ type: 'error', text1: 'Unable to mark Time In', text2: result.payload });
    }
  };

  const handleTimeOut = async () => {
    const result = await dispatch(markTimeOut());
    if (markTimeOut.fulfilled.match(result)) {
      Toast.show({ type: 'success', text1: 'Time Out marked successfully' });
    } else {
      Toast.show({ type: 'error', text1: 'Unable to mark Time Out', text2: result.payload });
    }
  };

  const hasTimedIn = !!today?.time_in;
  const hasTimedOut = !!today?.time_out;

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'} 👋</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      <Card style={styles.attendanceCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Today's Attendance</Text>
          {today?.status ? (
            <StatusBadge status={today.status} colorMap={ATTENDANCE_STATUS_COLORS} />
          ) : (
            <StatusBadge status="not_marked" colorMap={ATTENDANCE_STATUS_COLORS} label="Not marked" />
          )}
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Icon name="log-in" size={18} color={COLORS.success} />
            <Text style={styles.timeLabel}>Time In</Text>
            <Text style={styles.timeValue}>{formatTime(today?.time_in)}</Text>
          </View>
          <View style={styles.timeBlock}>
            <Icon name="log-out" size={18} color={COLORS.danger} />
            <Text style={styles.timeLabel}>Time Out</Text>
            <Text style={styles.timeValue}>{formatTime(today?.time_out)}</Text>
          </View>
        </View>

        {!hasTimedIn ? (
          <Button title="Time In" onPress={handleTimeIn} loading={status === 'loading'} />
        ) : !hasTimedOut ? (
          <Button title="Time Out" variant="danger" onPress={handleTimeOut} loading={status === 'loading'} />
        ) : (
          <View style={styles.doneBanner}>
            <Icon name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.doneText}>Attendance completed for today</Text>
          </View>
        )}
      </Card>

      {summary && (
        <>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.monthly_present_days ?? 0}</Text>
              <Text style={styles.statLabel}>Present (mo.)</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.monthly_late_days ?? 0}</Text>
              <Text style={styles.statLabel}>Late (mo.)</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.pending_leave_requests ?? 0}</Text>
              <Text style={styles.statLabel}>Pending Leaves</Text>
            </Card>
          </View>

          <Card style={styles.balanceCard}>
            <Text style={styles.cardTitle}>Leave Balance</Text>
            {(summary.leave_balance || []).map((b) => (
              <View key={b.leave_type} style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>{b.leave_type}</Text>
                <Text style={styles.balanceValue}>{b.remaining_days} days</Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  date: { fontSize: 13, color: COLORS.muted, marginTop: 2, marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  attendanceCard: { marginBottom: 16 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  timeBlock: { alignItems: 'center' },
  timeLabel: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  timeValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  doneBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  doneText: { color: COLORS.success, fontWeight: '600', marginLeft: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 4, textAlign: 'center' },
  balanceCard: {},
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  balanceLabel: { color: COLORS.text, fontSize: 14 },
  balanceValue: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});
