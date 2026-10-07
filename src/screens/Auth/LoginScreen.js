import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { loginUser } from '../../store/slices/authSlice';
import { COLORS } from '../../utils/constants';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.rejected.match(result)) {
      Toast.show({ type: 'error', text1: 'Login Failed', text2: result.payload || 'Please try again.' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>AMS</Text>
          </View>
          <Text style={styles.title}>Attendance Management</Text>
          <Text style={styles.subtitle}>Sign in to mark your attendance</Text>
        </View>

        <Input
          label="Email"
          placeholder="you@company.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <Button title="Sign In" onPress={handleLogin} loading={status === 'loading'} style={styles.loginBtn} />

        <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot your password?
        </Text>

        <Text style={styles.footnote}>
          Don't have an account? Contact your administrator to get set up.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  loginBtn: { marginTop: 8 },
  forgot: { color: COLORS.primary, textAlign: 'center', marginTop: 20, fontWeight: '600' },
  footnote: { color: COLORS.muted, textAlign: 'center', marginTop: 32, fontSize: 12 },
});
