import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import otherReducer from "./otherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    other: otherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
