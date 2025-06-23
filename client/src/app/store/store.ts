import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { counterSlice } from "../../features/contact/counterReducer";
import { catalogApi } from "../../features/catalog/catalogApi";
// ✅ newly added
import { uiSlice } from "../layout/uiSlice";
import { apiSlice } from "../api/apiSlice";

// ✅ configureStore with all slices and APIs
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // ✅ include basket API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogApi.middleware,
      apiSlice.middleware // ✅ include basket API middleware
    ),
});

// ✅ Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
