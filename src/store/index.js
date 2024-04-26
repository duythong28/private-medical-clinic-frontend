import { configureStore } from "@reduxjs/toolkit";
import prescriptionSlice from "./prescription";
import userSlice from "./user";

const store = configureStore({
  reducer: {
    prescription: prescriptionSlice,
    user: userSlice,
  },
});

export default store;
