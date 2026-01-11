import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { User } from '../user/userSlice';
import type { RootState } from '../../redux/store';
import { authApi, type AuthResponse } from './authApi';

export interface AuthState {
  status: 'unknown' | 'checking' | 'authenticated' | 'unauthenticated';
  user: User | null;
  userToken: string | null;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  status: 'unknown',
  user: null,
  userToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userToken = null;
      state.status = 'unauthenticated';
    },
    setCheckingAuth: (state) => {
      state.status = 'checking';
    },
    setUnauthenticated: (state) => {
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchPending,
          authApi.endpoints.logout.matchPending,
          authApi.endpoints.register.matchPending,
          authApi.endpoints.refresh.matchPending,
          authApi.endpoints.googleLogin.matchPending
        ),
        (state) => {
          state.status = 'checking';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchRejected,
          authApi.endpoints.register.matchRejected,
          authApi.endpoints.refresh.matchRejected,
          authApi.endpoints.googleLogin.matchRejected
        ),
        (state, action) => {
          state.status = 'unauthenticated';
          state.error = action.error?.message ?? 'Authentication failed';
          state.user = null;
          state.userToken = null;
        }
      )
      .addMatcher(
        (action) =>
          isAnyOf(
            authApi.endpoints.login.matchFulfilled,
            authApi.endpoints.register.matchFulfilled,
            authApi.endpoints.refresh.matchFulfilled,
            authApi.endpoints.googleLogin.matchFulfilled
          )(action),
        (state, action) => {
          const payload = action.payload as AuthResponse;
          state.user = payload.user;
          state.userToken = payload.accessToken;
          state.status = 'authenticated';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.logout.matchFulfilled,
          authApi.endpoints.logout.matchRejected
        ),
        (state) => {
          state.status = 'unauthenticated';
          state.user = null;
          state.userToken = null;
        }
      );
  },
});

export const { logout, setCheckingAuth, setUnauthenticated } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
