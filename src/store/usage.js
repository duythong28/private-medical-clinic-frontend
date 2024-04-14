import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUsage } from "../services/usage";

const initialState = localStorage.getItem("refreshToken") ? await fetchAllUsage() : [];

const usageSlice = createSlice({
  name: "usage",
  initialState: initialState ,
  reducers: {},
});

export default usageSlice.reducer;

export const usageAction = usageSlice.actions;
