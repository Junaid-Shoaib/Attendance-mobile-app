# Attendance Management System — Mobile App (React Native)

GPS-enabled attendance, leave, and profile management app for Employees,
Managers, and Super Admins. Built with React Native, Redux Toolkit, React
Navigation, and Axios, talking to the Laravel 12 backend in `../backend`.

## Features implemented

- Role-aware navigation: distinct tab flows for Employee, Manager, and
  Super Admin, driven by the authenticated user's role
- Secure login with device fingerprinting (device ID, name, OS, app
  version, root/jailbreak flag) sent on every login and attendance mark
- Time In / Time Out with mandatory GPS capture, mock-location flagging,
  and optional selfie upload — mirrors every backend security check
- Attendance history, monthly calendar view with color-coded status
  (present/absent/leave/holiday/late)
- Leave management: view balance, apply with reason/attachment, cancel,
  and (for managers) approve/reject team requests
- Attendance regularization request + manager approval screen
- Profile management: avatar upload, contact info, change password,
  registered devices
- Push notification token registration (Firebase Cloud Messaging) +
  in-app notifications list with read/unread state
- Admin: employee CRUD, device approval queue, attendance reports,
  company-wide dashboard
- Manager: team dashboard, team attendance, leave & regularization queues

## Requirements

- Node.js 18+
- Watchman (macOS) / standard RN environment setup
- Android Studio (Android) and/or Xcode (iOS) — see the official React
  Native environment setup guide for your OS
- A running instance of the Laravel backend (see `../backend/README.md`)

## Setup

```bash
# 1. Install dependencies
npm install

# iOS only
cd ios && pod install && cd ..

# 2. Point the app at your backend
#    Edit src/services/api.js -> API_BASE_URL
#    - Android emulator: http://10.0.2.2:8000/api/v1
#    - iOS simulator:    http://localhost:8000/api/v1
#    - Physical device:  http://<your-machine-lan-ip>:8000/api/v1

# 3. Run
npm run android
# or
npm run ios
```

## Firebase Cloud Messaging (push notifications)

1. Create a Firebase project and add Android/iOS apps.
2. Drop `google-services.json` into `android/app/` and
   `GoogleService-Info.plist` into `ios/`.
3. Call `initPushNotifications()` (see `src/pushNotifications.js`) right
   after a successful login to request permission and register the
   device's FCM token with the backend.

## Native permissions to configure

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS** (`ios/AttendanceManagementApp/Info.plist`):
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to verify attendance at your office/client site.</string>
<key>NSCameraUsageDescription</key>
<string>Used to capture an optional selfie when marking attendance.</string>
```

## Project structure

```
src/
  navigation/       RootNavigator + per-role navigators (Auth/Employee/Manager/Admin)
  screens/
    Auth/           Login, Forgot Password
    Employee/       Dashboard, History, Calendar, Leave, Regularization, Profile, Notifications
    Manager/        Dashboard, Team Attendance, Leave Approvals, Regularization Approvals
    Admin/          Dashboard, Employee CRUD, Device Approvals, Reports
  components/       Reusable UI: Button, Input, Card, StatusBadge, ScreenContainer
  services/         Axios-based API clients, one per domain (auth, attendance, leave, ...)
  store/            Redux Toolkit store + slices (auth, attendance)
  utils/            deviceUtils (fingerprint/root detection), locationUtils (GPS + mock
                     detection), dateUtils, constants (colors, roles)
```

## How the security checks map to the backend

Every Time In / Time Out call gathers, via `utils/deviceUtils.js` and
`utils/locationUtils.js`:

- `latitude` / `longitude` (GPS, permission-gated)
- `is_mock_location` (from the OS `mocked` flag on Android position objects)
- `is_rooted_or_jailbroken` (via `jail-monkey`)
- `device_id` / `device_name` / `platform` / `os_version` / `app_version`
  (via `react-native-device-info`)
- `device_timestamp` (device clock, compared server-side against drift)
- optional `selfie` (via `react-native-image-picker`)

These are sent to `/attendance/time-in` and `/attendance/time-out`, where
the backend's `AttendanceSecurityService` enforces geofencing, device
binding/approval, and all other mandatory checks described in the project
brief.

## API documentation

See `../docs/openapi.yaml` and `../docs/postman_collection.json`.
