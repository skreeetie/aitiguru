import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthed: boolean;
}

const initialState: AuthState = {
  isAuthed: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: {payload: boolean}) => {
      state.isAuthed = action.payload;
    }
  }
})

export const {setAuth} = authSlice.actions;

export default authSlice.reducer;