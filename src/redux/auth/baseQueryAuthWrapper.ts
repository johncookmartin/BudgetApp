import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { RootState } from '../store';
import { AUTH_API_ROOT } from './authApi';
import { logout } from './authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:8000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryAuthWrapper: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const isAuthCall =
      typeof args !== 'string' &&
      typeof args.url === 'string' &&
      args.url.startsWith(AUTH_API_ROOT);

    if (isAuthCall) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      { url: `${AUTH_API_ROOT}/refresh-token`, method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
