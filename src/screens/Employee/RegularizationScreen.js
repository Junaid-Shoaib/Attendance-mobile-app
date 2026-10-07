import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, View } from 'react-native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { applyRegularization, getMyRegularizations } from '../../services/regularizationService';
import { formatDate } from '../../utils/dateUtils';
import { LEAVE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function RegularizationScreen() {
  const [attendanceDate, setAttendanceDate] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);

  const load = async () => {
    const result = await getMyRegularizations({ per_page: 20 });
    setHistory(result.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!attendanceDate || !reason) {
      Toast.show({ type: 'error', text1: 'Date and reason are required' });
      return;
    }
    setSubmitting(true);
    try {
      await applyRegularization({
        attendance_date: attendanceDate,
        requested_time_in: timeIn || undefined,
        requested_time_out: timeOut || undefined,
        reason,
      });
      Toast.show({ type: 'success', text1: 'Correction request submitted' });
      setAttendanceDate('');
      setTimeIn('');
      setTimeOut('');
      setReason('');
      load();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Submission failed', text2: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.intro}>
        Forgot to mark Time In or Time Out? Submit a correction request for your manager or admin to
        review — approval updates your attendance record without deducting leave.
      </Text>

      <Input label="Attendance Date (YYYY-MM-DD)" placeholder="2026-07-08" value={attendanceDate} onChangeText={setAttendanceDate} />
      <Input label="Correct Time In (YYYY-MM-DD HH:mm)" placeholder="2026-07-08 09:00" value={timeIn} onChangeText={setTimeIn} />
      <Input label="Correct Time Out (YYYY-MM-DD HH:mm)" placeholder="2026-07-08 18:00" value={timeOut} onChangeText={setTimeOut} />
      <Input
        label="Reason"
        placeholder="Explain what happened"
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
        style={{ height: 90, textAlignVertical: 'top' }}
      />

      <Button title="Submit Correction Request" onPress={handleSubmit} loading={submitting} />

      <Text style={styles.historyTitle}>Recent Requests</Text>
      {history.map((item) => (
        <Card key={item.id} style={styles.historyCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.historyDate}>{formatDate(item.attendance_date)}</Text>
            <StatusBadge status={item.status} colorMap={LEAVE_STATUS_COLORS} />
          </View>
          <Text style={styles.historyReason}>{item.reason}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { color: COLORS.muted, fontSize: 13, marginBottom: 20, lineHeight: 19 },
  historyTitle: { fontWeight: '700', marginTop: 24, marginBottom: 12, color: COLORS.text },
  historyCard: { marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  historyDate: { fontWeight: '600', color: COLORS.text },
  historyReason: { color: COLORS.muted, fontSize: 13 },
});
