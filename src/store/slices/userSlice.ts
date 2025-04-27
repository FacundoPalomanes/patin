import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  phoneNumber: string;
  fechaNacimiento: string;
  categoria: string;
  dni: string;
  photoURL: string;
}

const initialState: UserState | null = null;


const userSlice = createSlice({
  name: 'user',
  initialState: null as UserState | null,
  reducers: {
    setUser: (_state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => initialState,
  },
});


export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
