# iOS Native Project

This folder contains the hand-editable native iOS source files matching
the standard RN 0.75 template: `Podfile`, `AppDelegate.h/.mm`, `main.m`,
`Info.plist`, `LaunchScreen.storyboard`, and the asset catalog.

## Important: the Xcode project file

Apple's `.xcodeproj/project.pbxproj` is a large, tool-generated project
descriptor (not something meant to be hand-authored — Xcode itself
rewrites it constantly and a hand-written one is highly error-prone). It
is **not included** in this source delivery. To get a working `.xcodeproj`:

```bash
# From the frontend/ directory, after `npm install`:
npx react-native init TempScaffold --version 0.75.4 --skip-install
# This creates TempScaffold/ios/TempScaffold.xcodeproj — a clean,
# correctly-generated Xcode project for the same RN version.

# Then:
# 1. Copy TempScaffold/ios/TempScaffold.xcodeproj into this ios/ folder,
#    renaming it to AttendanceManagementApp.xcodeproj
# 2. Open it in Xcode, rename the target/scheme to "AttendanceManagementApp"
#    (or just keep the generated name — either works)
# 3. Replace the generated AppDelegate.h/.mm, Info.plist, main.m, and
#    LaunchScreen.storyboard with the versions already in this folder
# 4. Add the Firebase pods (already declared in this Podfile) and run:
cd ios && pod install
```

This two-step process (generate a throwaway project for its `.xcodeproj`,
then drop in this delivery's source files) is the standard, safe way to
get a valid Xcode project without hand-authoring a fragile pbxproj file.

## Firebase setup

Download `GoogleService-Info.plist` from the Firebase console and add it
to the `AttendanceManagementApp/` folder in Xcode (ensure "Copy items if
needed" is checked and it's added to the app target).

## Build & run

```bash
cd ..              # project root (frontend/)
npm install
cd ios && pod install && cd ..
npm run ios
```
