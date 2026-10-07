import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../../services/authService';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, fcmToken }, { rejectWithValue }) => {
    try {
      return await authService.login(email, password, fcmToken);
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const restoreSession = createAsyncThunk('auth/restore', async () => {
  const token = await AsyncStorage.getItem('auth_token');
  const userJson = await AsyncStorage.getItem('auth_user');
  if (token && userJson) {
    return { token, user: JSON.parse(userJson) };
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    bootstrapped: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
        state.bootstrapped = true;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
