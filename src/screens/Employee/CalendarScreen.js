import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

import ScreenContainer from '../../components/ScreenContainer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCalendar } from '../../services/attendanceService';
import { ATTENDANCE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(new Date());

  const load = useCallback(async (date) => {
    setLoading(true);
    try {
      const records = await getCalendar(date.getMonth() + 1, date.getFullYear());
      const marks = {};
      Object.entries(records).forEach(([day, record]) => {
        marks[day] = {
          customStyles: {
            container: {
              backgroundColor: (ATTENDANCE_STATUS_COLORS[record.status] || COLORS.border) + '33',
              borderRadius: 8,
            },
            text: { color: ATTENDANCE_STATUS_COLORS[record.status] || COLORS.text, fontWeight: '700' },
          },
        };
      });
      setMarkedDates(marks);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(current);
    }, [load, current])
  );

  return (
    <ScreenContainer>
      <Calendar
        current={current.toISOString().split('T')[0]}
        markingType="custom"
        markedDates={markedDates}
        onMonthChange={(m) => setCurrent(new Date(m.year, m.month - 1, 1))}
        theme={{ todayTextColor: COLORS.primary, arrowColor: COLORS.primary }}
      />
      {loading && <LoadingSpinner />}

      <View style={styles.legend}>
        {Object.entries(ATTENDANCE_STATUS_COLORS)
          .filter(([k]) => k !== 'not_marked')
          .map(([key, color]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{key.replace('_', ' ')}</Text>
            </View>
          ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: COLORS.muted, textTransform: 'capitalize' },
});
