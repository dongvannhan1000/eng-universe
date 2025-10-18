// src/features/ui/slices/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthTab = "login" | "register" | "forgot";
interface AuthDialogState {
  authDialogOpen: boolean;
  authActiveTab: AuthTab;
}

const initialState: AuthDialogState = {
  authDialogOpen: false,
  authActiveTab: "login",
};

const authDialogSlice = createSlice({
  name: "authDialog",
  initialState,
  reducers: {
    openAuthDialog(state, action: PayloadAction<{ tab?: AuthTab } | undefined>) {
      state.authDialogOpen = true;
      if (action?.payload?.tab) state.authActiveTab = action.payload.tab;
    },
    closeAuthDialog(state) {
      state.authDialogOpen = false;
    },
    setAuthActiveTab(state, action: PayloadAction<AuthTab>) {
      state.authActiveTab = action.payload;
    },
  },
});

export const { openAuthDialog, closeAuthDialog, setAuthActiveTab } = authDialogSlice.actions;
export default authDialogSlice.reducer;
