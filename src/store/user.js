import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      return user;
    },
    
    removeUser() {
      return null;
    },
  },
});

export default userSlice.reducer;

export const userAction = userSlice.actions;
