import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../utils/constants';

import DashboardScreen from '../screens/Employee/DashboardScreen';
import AttendanceHistoryScreen from '../screens/Employee/AttendanceHistoryScreen';
import CalendarScreen from '../screens/Employee/CalendarScreen';
import LeaveListScreen from '../screens/Employee/LeaveListScreen';
import ApplyLeaveScreen from '../screens/Employee/ApplyLeaveScreen';
import RegularizationScreen from '../screens/Employee/RegularizationScreen';
import ProfileScreen from '../screens/Employee/ProfileScreen';
import NotificationsScreen from '../screens/Employee/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LeaveStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LeaveList" component={LeaveListScreen} options={{ title: 'My Leaves' }} />
      <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} options={{ title: 'Apply for Leave' }} />
      <Stack.Screen
        name="Regularization"
        component={RegularizationScreen}
        options={{ title: 'Attendance Correction' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
}

export default function EmployeeNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'Home',
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            History: 'clock',
            Calendar: 'calendar',
            Leaves: 'file-text',
            Notifications: 'bell',
            Profile: 'user',
          };
          console.log({color});
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="History" component={AttendanceHistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Leaves" component={LeaveStack} options={{ headerShown: false, title: 'Leave' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
