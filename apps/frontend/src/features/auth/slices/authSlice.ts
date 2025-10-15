import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginRequest, RegisterRequest } from "../types";
import * as authApi from "../api/authApi";

// Initial state - no localStorage, auth is managed via HTTPOnly cookies
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginRequest) => {
  const response = await authApi.login(credentials);
  return response;
});

export const registerUser = createAsyncThunk("auth/register", async (data: RegisterRequest) => {
  const response = await authApi.register(data);
  return response;
});

export const verifyAuth = createAsyncThunk("auth/verify", async () => {
  const user = await authApi.getCurrentUser();
  return user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Login failed";
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Registration failed";
    });

    // Verify auth
    builder.addCase(verifyAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(verifyAuth.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
