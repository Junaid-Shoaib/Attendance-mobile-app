import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import JailMonkey from 'jail-monkey';

/**
 * Requests OS-level location permission. Must be granted before any
 * attendance action is attempted (mandatory check #1 & #3 in the brief).
 */
export async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission Required',
        message: 'This app needs access to your location to mark attendance accurately.',
        buttonPositive: 'Allow',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS: react-native-geolocation-service triggers the system prompt
  // automatically on first getCurrentPosition() call when configured
  // with the appropriate Info.plist usage description keys.
  return true;
}

/**
 * Resolves the current GPS coordinates with high accuracy, and flags
 * whether the position looks like it came from a mock-location provider
 * (Android exposes `mocked` on the position object).
 */
export function getCurrentPosition() {
  return new Promise(async (resolve, reject) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return reject(new Error('Location permission was not granted. Please enable it in Settings.'));
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const isMock =
          !!position.mocked || JailMonkey.isOnExternalStorage?.() === true;

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isMock,
        });
      },
      (error) => reject(new Error(error.message || 'Unable to determine your location. Please enable GPS.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}
