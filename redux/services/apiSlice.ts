// from redux docs
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { setAuth, logout } from '../features/authSlice'
import { Mutex } from 'async-mutex'

// Keeps user logged in on age refreshes

console.log('NEXT_PUBLIC_HOST', process.env.NEXT_PUBLIC_HOST)
// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    console.log(getState())
      const token = getState().auth.token; // Access token from state
      if (token) {
          headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
  },
});


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log("Executing baseQueryWithReauth at", new Date().toISOString());

  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting refresh.");
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
            // refresh request
            {
                url: '/jwt/refresh/',
                method: 'POST'
            },
          api,
          extraOptions
        )
        console.log('Headers after refresh attempt:', args);
        if (refreshResult.data) {
          console.log("Token refreshed successfully:", refreshResult.data);
          api.dispatch(setAuth())
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log("Refresh failed, logging out.");
          api.dispatch(logout())
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: buuilder => ({}),
})
