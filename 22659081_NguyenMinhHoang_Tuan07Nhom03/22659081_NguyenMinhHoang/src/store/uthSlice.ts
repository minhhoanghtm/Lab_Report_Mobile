import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, type PayloadAction, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import { isSessionValid, type AuthResponse, type User } from '../services/authService';
import type { RootState } from './index';

const STORAGE_KEY = '@bookstore/session';
type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isReady: boolean;
};
type AuthThunk = ThunkAction<Promise<void>, RootState, unknown, UnknownAction>;
const initialState: AuthState = {
  token: null, user: null, isLoggedIn: false, isReady: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    logoutState(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    finishRestore(state) { state.isReady = true; },
  },
});
export const { setCredentials, logoutState, finishRestore } = authSlice.actions;
export const loginSuccess = (session: AuthResponse): AuthThunk => async (dispatch) => {
  if (!isSessionValid(session)) throw new Error('Dữ liệu phiên đăng nhập không hợp lệ.');
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  dispatch(setCredentials(session));
};
export const restoreSession = (): AuthThunk => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const session: unknown = JSON.parse(raw);
      if (isSessionValid(session)) dispatch(setCredentials(session));
      else await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    dispatch(logoutState());
    try { await AsyncStorage.removeItem(STORAGE_KEY); }
    catch { /* Storage can be unavailable; finish initialization regardless. */ }
  } finally {
    dispatch(finishRestore());
  }
};
export const logout = (): AuthThunk => async (dispatch) => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  dispatch(logoutState());
};
export default authSlice.reducer;
