import React from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/constants';

export default function ScreenContainer({ children, scroll = true, refreshing, onRefresh }) {
  const Wrapper = scroll ? ScrollView : View;
  const extraProps = scroll
    ? {
        contentContainerStyle: styles.scrollContent,
        refreshControl: onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        ) : undefined,
      }
    : { style: styles.flex };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Wrapper {...extraProps}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
});
