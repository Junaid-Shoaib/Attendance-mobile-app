import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { COLORS } from '../../utils/constants';

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNotifications({ per_page: 30 });
      setItems(result.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handlePress = async (item) => {
    if (!item.read_at) {
      await markAsRead(item.id);
      load();
    }
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScreenContainer scroll={false}>
      <TouchableOpacity style={styles.markAll} onPress={handleMarkAll}>
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>You're all caught up.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Card style={[styles.card, !item.read_at && styles.unread]}>
              <View style={styles.rowTop}>
                <Icon name="bell" size={16} color={COLORS.primary} />
                <Text style={styles.title}>{item.data?.title || 'Notification'}</Text>
              </View>
              <Text style={styles.message}>{item.data?.message}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  markAll: { alignSelf: 'flex-end', marginRight: 16, marginTop: 12 },
  markAllText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  list: { padding: 16 },
  card: { marginBottom: 10 },
  unread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { fontWeight: '700', color: COLORS.text, marginLeft: 8 },
  message: { color: COLORS.muted, fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: COLORS.muted },
});
