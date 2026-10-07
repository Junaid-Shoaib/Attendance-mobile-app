import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAdminDashboard } from '../../services/dashboardService';
import { COLORS } from '../../utils/constants';

export default function AdminDashboardScreen() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await getAdminDashboard());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading || !summary) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Employees', value: summary.total_employees },
    { label: 'Present Today', value: summary.present_today },
    { label: 'Absent Today', value: summary.absent_today },
    { label: 'On Leave Today', value: summary.on_leave_today },
    { label: 'Late Arrivals', value: summary.late_today },
    { label: 'Attendance %', value: `${summary.attendance_percentage}%` },
    { label: 'Pending Leave Requests', value: summary.pending_leave_requests },
    { label: 'Pending Device Approvals', value: summary.pending_device_approvals },
  ];

  return (
    <ScreenContainer refreshing={loading} onRefresh={load}>
      <Text style={styles.heading}>Company Overview</Text>
      <View style={styles.grid}>
        {stats.map((s) => (
          <Card key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: 20 },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 6, textAlign: 'center' },
});
