// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { counterSlice } from "../../features/contact/counterReducer";
import { catalogApi } from "../../features/catalog/catalogApi";
import { uiSlice } from "../layout/uiSlice";
import { apiSlice } from "../api/apiSlice";
import accountReducer from "../../features/account/accountSlice"; // ✅ import

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    ui: uiSlice.reducer,
    account: accountReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware, apiSlice.middleware),
});

// ✅ Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
