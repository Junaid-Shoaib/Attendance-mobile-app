import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as attendanceService from '../../services/attendanceService';

export const fetchToday = createAsyncThunk('attendance/fetchToday', async () => {
  return attendanceService.getToday();
});

export const markTimeIn = createAsyncThunk(
  'attendance/timeIn',
  async (selfieUri, { rejectWithValue }) => {
    try {
      return await attendanceService.timeIn(selfieUri);
    } catch (err) {
      return rejectWithValue(err.message || 'Time In failed');
    }
  }
);

export const markTimeOut = createAsyncThunk(
  'attendance/timeOut',
  async (selfieUri, { rejectWithValue }) => {
    try {
      return await attendanceService.timeOut(selfieUri);
    } catch (err) {
      return rejectWithValue(err.message || 'Time Out failed');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    today: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchToday.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(markTimeIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(markTimeIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.today = action.payload;
      })
      .addCase(markTimeIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(markTimeOut.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(markTimeOut.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.today = action.payload;
      })
      .addCase(markTimeOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
