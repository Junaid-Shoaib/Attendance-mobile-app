import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '../utils/constants';

import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import EmployeeListScreen from '../screens/Admin/EmployeeListScreen';
import EmployeeFormScreen from '../screens/Admin/EmployeeFormScreen';
import DeviceApprovalScreen from '../screens/Admin/DeviceApprovalScreen';
import ReportsScreen from '../screens/Admin/ReportsScreen';
import ProfileScreen from '../screens/Employee/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EmployeesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeList" component={EmployeeListScreen} options={{ title: 'Employees' }} />
      <Stack.Screen name="EmployeeForm" component={EmployeeFormScreen} options={{ title: 'Add / Edit Employee' }} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Dashboard' || route.name === 'Devices' || route.name === 'Reports',
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'grid',
            Employees: 'users',
            Devices: 'smartphone',
            Reports: 'bar-chart-2',
            Profile: 'user',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Employees" component={EmployeesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Devices" component={DeviceApprovalScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
