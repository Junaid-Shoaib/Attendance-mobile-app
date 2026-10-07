import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';

import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenContainer from '../../components/ScreenContainer';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      Toast.show({ type: 'success', text1: 'Reset link sent', text2: 'Check your email inbox.' });
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Something went wrong', text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.description}>
        Enter your registered email address and we'll send you a link to reset your password.
      </Text>
      <Input
        label="Email"
        placeholder="you@company.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  description: { marginBottom: 20, color: '#64748B', lineHeight: 20 },
});
