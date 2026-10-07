import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getManagerDashboard } from '../../services/dashboardService';
import { COLORS } from '../../utils/constants';

export default function ManagerDashboardScreen() {
  const { user } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await getManagerDashboard());
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
    { label: 'Team Size', value: summary.team_size },
    { label: 'Present Today', value: summary.present_today },
    { label: 'Pending Leave Approvals', value: summary.pending_leave_approvals },
    { label: 'Pending Corrections', value: summary.pending_regularizations },
  ];

  return (
    <ScreenContainer refreshing={loading} onRefresh={load}>
      <Text style={styles.greeting}>Welcome back, {user?.name?.split(' ')[0]}</Text>
      <Text style={styles.subtitle}>Here's how your team is doing today</Text>

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
  greeting: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.muted, marginBottom: 20, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'center', paddingVertical: 20 },
  statValue: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 6, textAlign: 'center' },
});
