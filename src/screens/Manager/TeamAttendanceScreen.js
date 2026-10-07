import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getTeamAttendance } from '../../services/dashboardService';
import { formatTime, today } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function TeamAttendanceScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTeamAttendance(today());
      setRecords(result || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.heading}>Team Attendance — Today</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No attendance marked yet today.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View>
              <Text style={styles.name}>{item.user?.name}</Text>
              <Text style={styles.times}>
                In {formatTime(item.time_in)} · Out {formatTime(item.time_out)}
              </Text>
            </View>
            <StatusBadge status={item.status} colorMap={ATTENDANCE_STATUS_COLORS} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 16, fontWeight: '700', color: COLORS.text, margin: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  name: { fontWeight: '700', color: COLORS.text },
  times: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
