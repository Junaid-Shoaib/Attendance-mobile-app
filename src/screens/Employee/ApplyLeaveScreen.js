import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { getLeaveTypes, getLeaveBalance, applyLeave } from '../../services/leaveService';
import { COLORS } from '../../utils/constants';

export default function ApplyLeaveScreen({ navigation }) {
  const [types, setTypes] = useState([]);
  const [balance, setBalance] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const [typesData, balanceData] = await Promise.all([getLeaveTypes(), getLeaveBalance()]);
      setTypes(typesData);
      setBalance(balanceData);
      if (typesData.length) setLeaveTypeId(typesData[0].id);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!leaveTypeId || !startDate || !endDate || !reason) {
      Toast.show({ type: 'error', text1: 'Please fill in all required fields' });
      return;
    }
    setSubmitting(true);
    try {
      await applyLeave({ leave_type_id: leaveTypeId, start_date: startDate, end_date: endDate, reason });
      Toast.show({ type: 'success', text1: 'Leave request submitted' });
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Submission failed', text2: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.label}>Leave Type</Text>
      <View style={styles.typeRow}>
        {types.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.typeChip, leaveTypeId === t.id && styles.typeChipActive]}
            onPress={() => setLeaveTypeId(t.id)}>
            <Text style={[styles.typeChipText, leaveTypeId === t.id && styles.typeChipTextActive]}>
              {t.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Available Balance</Text>
        {balance.map((b) => (
          <View key={b.leave_type} style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>{b.leave_type}</Text>
            <Text style={styles.balanceValue}>{b.remaining_days} days</Text>
          </View>
        ))}
      </Card>

      <Input label="Start Date (YYYY-MM-DD)" placeholder="2026-08-01" value={startDate} onChangeText={setStartDate} />
      <Input label="End Date (YYYY-MM-DD)" placeholder="2026-08-03" value={endDate} onChangeText={setEndDate} />
      <Input
        label="Reason"
        placeholder="Briefly describe the reason for leave"
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />

      <Button title="Submit Request" onPress={handleSubmit} loading={submitting} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeChipText: { color: COLORS.text, fontSize: 13 },
  typeChipTextActive: { color: '#fff', fontWeight: '600' },
  balanceCard: { marginBottom: 16 },
  balanceTitle: { fontWeight: '700', marginBottom: 8, color: COLORS.text },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  balanceLabel: { color: COLORS.muted, fontSize: 13 },
  balanceValue: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
});
