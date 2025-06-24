import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  loginid: number;
  UserName: string;
};

type AccountState = {
  user: User | null;
};

// ✅ Load from localStorage if exists
const storedUser = localStorage.getItem("user");
const initialState: AccountState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // 💾 persist user
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // ❌ remove on logout
    },
  },
});

export const { setUser, logoutUser } = accountSlice.actions;
export default accountSlice.reducer;
