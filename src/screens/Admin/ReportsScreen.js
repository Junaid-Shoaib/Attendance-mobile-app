import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_COLORS, COLORS } from '../../utils/constants';

export default function ReportsScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/reports/attendance', { params: { from, to } });
      setRecords(data.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.filters}>
        <Text style={styles.heading}>Attendance Report</Text>
        <Input label="From (YYYY-MM-DD)" value={from} onChangeText={setFrom} />
        <Input label="To (YYYY-MM-DD)" value={to} onChangeText={setTo} />
        <Button title="Generate Report" onPress={runReport} loading={loading} />
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Run a report to see results here.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View>
              <Text style={styles.name}>{item.user?.name}</Text>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
            <StatusBadge status={item.status} colorMap={ATTENDANCE_STATUS_COLORS} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: 16, paddingTop: 8 },
  heading: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  list: { padding: 16, paddingTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  name: { fontWeight: '700', color: COLORS.text },
  date: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 20, color: COLORS.muted },
});
