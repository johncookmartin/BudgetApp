import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryAuthWrapper } from './auth/baseQueryAuthWrapper';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryAuthWrapper,
  endpoints: () => ({}),
});
