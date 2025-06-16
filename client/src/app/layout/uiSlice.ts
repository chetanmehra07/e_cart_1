import { createSlice } from "@reduxjs/toolkit";
const getInitialDarkMOde = () => {
  const storedDarkMOde = localStorage.getItem("darkMode");
  return storedDarkMOde ? JSON.parse(storedDarkMOde) : true;
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoading: false,
    darkMode: getInitialDarkMOde(),
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setDarkMode: (state) => {
      localStorage.setItem("darkMode", JSON.stringify(!state.darkMode));
      state.darkMode = !state.darkMode;
    },
  },
});

export const { startLoading, stopLoading, setDarkMode } = uiSlice.actions;
