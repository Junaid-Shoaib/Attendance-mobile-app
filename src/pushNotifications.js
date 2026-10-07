import messaging from '@react-native-firebase/messaging';
import { registerFcmToken } from './services/profileService';
import { getDeviceContext } from './utils/deviceUtils';

/**
 * Requests notification permission, registers the FCM token with the
 * backend, and wires up foreground/background handlers. Call this once
 * after successful login (see LoginScreen / RootNavigator).
 */
export async function initPushNotifications() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) return;

  const token = await messaging().getToken();
  const device = await getDeviceContext();
  await registerFcmToken(token, device.device_id, device.platform);

  messaging().onTokenRefresh(async (newToken) => {
    await registerFcmToken(newToken, device.device_id, device.platform);
  });

  messaging().onMessage(async (remoteMessage) => {
    // Foreground push: surface via react-native-toast-message or a local
    // notification library of your choice (e.g. notifee).
    console.log('Foreground notification received:', remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification received:', remoteMessage);
  });
}
