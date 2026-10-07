// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import attendanceReducer from './slices/attendanceSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     attendance: attendanceReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });


import { configureStore } from '@reduxjs/toolkit';

// import authReducer from './store/slices/authSlice';
// import attendanceReducer from './store/slices/attendanceSlice';
import authReducer from './store/slices/authSlice';
import attendanceReducer from './store/slices/attendanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});