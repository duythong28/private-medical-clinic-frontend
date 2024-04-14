import { configureStore } from "@reduxjs/toolkit";
import diseaseSlice from "./diseases";
import unitSlice from "./units";
import usageSlice from "./usage";
import drugSlice from "./drug";
import prescriptionSlice from "./prescription";

const store = configureStore({
  reducer: {
    unit: unitSlice,
    usage: usageSlice,
    disease: diseaseSlice,
    drug: drugSlice,
    prescription: prescriptionSlice,
  },
});

export default store;
