import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getHistory } from '../../services/attendanceService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function AttendanceHistoryScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getHistory({ per_page: 50 });
      setRecords(result.data || []);
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
      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No attendance records yet.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <Text style={styles.times}>
                In {formatTime(item.time_in)}  ·  Out {formatTime(item.time_out)}
              </Text>
              {item.working_hours ? (
                <Text style={styles.hours}>{item.working_hours} hrs worked</Text>
              ) : null}
            </View>
            <StatusBadge status={item.status} colorMap={ATTENDANCE_STATUS_COLORS} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rowLeft: {},
  date: { fontWeight: '700', color: COLORS.text, fontSize: 14 },
  times: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  hours: { color: COLORS.primary, fontSize: 12, marginTop: 2, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
