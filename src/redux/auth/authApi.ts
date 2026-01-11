import { apiSlice } from '../apiSlice';
import type { User } from '../user/userSlice';

export const AUTH_API_ROOT = '/auth';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (payload) => ({
        url: `${AUTH_API_ROOT}/login`,
        method: 'POST',
        body: payload,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: `${AUTH_API_ROOT}/logout`,
        method: 'POST',
      }),
    }),
    refresh: build.mutation<AuthResponse, void>({
      query: () => ({
        url: `${AUTH_API_ROOT}/refresh-token`,
        method: 'POST',
      }),
    }),
    register: build.mutation<AuthResponse, LoginRequest>({
      query: (payload) => ({
        url: `${AUTH_API_ROOT}/register`,
        method: 'POST',
        body: payload,
      }),
    }),
    googleLogin: build.mutation<AuthResponse, { idToken: string }>({
      query: (payload) => ({
        url: `${AUTH_API_ROOT}/google-login`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
} = authApi;
