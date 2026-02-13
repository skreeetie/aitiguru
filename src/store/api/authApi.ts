import { baseApi } from "./baseApi";

interface User {
  id: number;
  username: string;
  accessToken: string;
}

interface Auth {
  username: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    authUser: build.mutation<User, Auth>({
      query: (data) => ({
        url: 'auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data})
      })
    })
  })
})

export const {useAuthUserMutation} = authApi;