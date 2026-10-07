import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getProfile, updateProfile, updateAvatar } from '../../services/profileService';
import { changePassword } from '../../services/authService';
import { logoutUser, setUser } from '../../store/slices/authSlice';
import { API_BASE_URL } from '../../services/api';
import { COLORS } from '../../utils/constants';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(user);
  const [phone, setPhone] = useState(user?.phone || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergency_contact_name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergency_contact_phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setProfile(data);
      dispatch(setUser(data));
    })();
  }, [dispatch]);

  const handlePickAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (result.assets?.[0]?.uri) {
      const updated = await updateAvatar(result.assets[0].uri);
      setProfile(updated);
      dispatch(setUser(updated));
      Toast.show({ type: 'success', text1: 'Profile picture updated' });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        phone,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
      });
      setProfile(updated);
      dispatch(setUser(updated));
      Toast.show({ type: 'success', text1: 'Profile updated' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await changePassword(currentPassword, newPassword, newPassword);
      Toast.show({ type: 'success', text1: 'Password changed' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Password change failed', text2: err.message });
    }
  };

  const avatarUri = profile?.profile_picture ? `${API_BASE_URL.replace('/api/v1', '')}/storage/${profile.profile_picture}` : null;

  return (
    <ScreenContainer>
      <Card style={styles.headerCard}>
        <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{profile?.name?.[0] || '?'}</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <Icon name="camera" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.meta}>{profile?.employee_id} · {profile?.designation?.title || profile?.role}</Text>
        <Text style={styles.meta}>{profile?.email}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Emergency Contact Name" value={emergencyName} onChangeText={setEmergencyName} />
        <Input label="Emergency Contact Phone" value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="phone-pad" />
        <Button title="Save Changes" onPress={handleSaveProfile} loading={saving} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <Input label="Current Password" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
        <Input label="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
        <Button title="Update Password" variant="outline" onPress={handleChangePassword} />
      </Card>

      <Button title="Log Out" variant="danger" onPress={() => dispatch(logoutUser())} style={{ marginTop: 8 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: { alignItems: 'center', marginBottom: 16 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  avatarPlaceholder: { backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#fff', fontSize: 28, fontWeight: '700' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  section: { marginBottom: 16 },
  sectionTitle: { fontWeight: '700', fontSize: 15, marginBottom: 12, color: COLORS.text },
});
