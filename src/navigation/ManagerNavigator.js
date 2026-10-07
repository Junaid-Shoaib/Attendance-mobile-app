import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../utils/constants';

import ManagerDashboardScreen from '../screens/Manager/ManagerDashboardScreen';
import TeamAttendanceScreen from '../screens/Manager/TeamAttendanceScreen';
import TeamLeavesScreen from '../screens/Manager/TeamLeavesScreen';
import RegularizationApprovalScreen from '../screens/Manager/RegularizationApprovalScreen';
import ProfileScreen from '../screens/Employee/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function ManagerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'grid',
            Team: 'users',
            Leaves: 'file-text',
            Corrections: 'edit-3',
            Profile: 'user',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} />
      <Tab.Screen name="Team" component={TeamAttendanceScreen} options={{ title: 'Team Attendance' }} />
      <Tab.Screen name="Leaves" component={TeamLeavesScreen} options={{ title: 'Leave Approvals' }} />
      <Tab.Screen
        name="Corrections"
        component={RegularizationApprovalScreen}
        options={{ title: 'Corrections' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
