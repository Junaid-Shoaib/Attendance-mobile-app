import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import JailMonkey from 'jail-monkey';

export async function getDeviceContext() {
  const device_id = await DeviceInfo.getUniqueId();
  const device_name = await DeviceInfo.getDeviceName();
  const os_version = DeviceInfo.getSystemVersion();
  const app_version = DeviceInfo.getVersion();

  const isJailBroken = JailMonkey.isJailBroken();
  const trustFall = JailMonkey.trustFall();

  console.log('JailMonkey isJailBroken:', isJailBroken);
  console.log('JailMonkey trustFall:', trustFall);

  return {
    device_id,
    device_name,
    platform: Platform.OS,
    os_version,
    app_version,

    // Sirf actual root/jailbreak detection
    is_rooted_or_jailbroken: Boolean(isJailBroken),
  };
}