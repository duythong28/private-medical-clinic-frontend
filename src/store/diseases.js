import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDisease } from "../services/diseases";

const initialState = localStorage.getItem("refreshToken") ? (await fetchAllDisease()) : [];

const diseaseSlice = createSlice({
  name: "disease",
  initialState: initialState,
  reducers: {},
});

export default diseaseSlice.reducer;

export const diseaseAction = diseaseSlice.actions;
