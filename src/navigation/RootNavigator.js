import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import EmployeeNavigator from './EmployeeNavigator';
import ManagerNavigator from './ManagerNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingSpinner from '../components/LoadingSpinner';
import { restoreSession } from '../store/slices/authSlice';
import { ROLES } from '../utils/constants';

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { user, token, bootstrapped } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (!bootstrapped) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {!token || !user ? (
        <AuthNavigator />
      ) : user.role === ROLES.SUPER_ADMIN ? (
        <AdminNavigator />
      ) : user.role === ROLES.MANAGER ? (
        <ManagerNavigator />
      ) : (
        <EmployeeNavigator />
      )}
    </NavigationContainer>
  );
}
