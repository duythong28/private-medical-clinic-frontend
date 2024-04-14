import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDrugs } from "../services/drugs";

const initialState = localStorage.getItem("refreshToken") ? await fetchAllDrugs() : [];

const drugSlice = createSlice({
  name: "drug",
  initialState: initialState ,
  reducers: {},
});

export default drugSlice.reducer;

export const drugAction = drugSlice.actions;
