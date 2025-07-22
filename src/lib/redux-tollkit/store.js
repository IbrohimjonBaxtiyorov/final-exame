import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/gap-club-slices.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
