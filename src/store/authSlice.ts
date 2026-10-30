import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api/client";

type LoginData = {
  userName: string;
  password: string;
};

type TokenData = {
  exp?: number;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
};

type AuthState = {
  token: string | null;
  userName: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

function readToken(token: string): TokenData | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return JSON.parse(decoded) as TokenData;
  } catch {
    return null;
  }
}

export function tokenExpiration(token: string): number | null {
  const data = readToken(token);
  if (typeof data?.exp !== "number") return null;
  return data.exp * 1000;
}

export function tokenIsCurrent(token: string): boolean {
  const data = readToken(token);
  if (!data || typeof data.exp !== "number" || data.exp * 1000 <= Date.now()) return false;

  const role = data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes("SuperAdmin");
}

const savedToken = sessionStorage.getItem("fastcart.admin.token");
const savedUser = sessionStorage.getItem("fastcart.admin.user");
const token = savedToken && savedUser === "SuperAdmin" && tokenIsCurrent(savedToken) ? savedToken : null;
if (!token) {
  sessionStorage.removeItem("fastcart.admin.token");
  sessionStorage.removeItem("fastcart.admin.user");
}

const initialState: AuthState = {
  token,
  userName: token ? sessionStorage.getItem("fastcart.admin.user") : null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<{ token: string; userName: string }, LoginData, { rejectValue: string }>("auth/login", async (loginData, { rejectWithValue }) => {
  if (loginData.userName !== "SuperAdmin") {
    return rejectWithValue("Incorrect username or password.");
  }

  try {
    const response = await api.post<{ data: string }>("/Account/login", loginData);
    const token = response.data?.data;
    const expiration = typeof token === "string" ? tokenExpiration(token) : null;

    if (typeof token !== "string" || !expiration || expiration <= Date.now()) {
      return rejectWithValue("The server returned an invalid or expired login token.");
    }
    if (!tokenIsCurrent(token)) {
      return rejectWithValue("This account does not have admin access.");
    }

    sessionStorage.setItem("fastcart.admin.token", token);
    sessionStorage.setItem("fastcart.admin.user", loginData.userName);
    return { token, userName: loginData.userName };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        return rejectWithValue("Incorrect username or password.");
      }
      if (error.response?.status === 403) {
        return rejectWithValue("This account does not have admin access.");
      }
    }
    return rejectWithValue("Could not connect to the server. Please try again.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      if (state.status === "failed") state.status = "idle";
    },
    logout(state) {
      sessionStorage.removeItem("fastcart.admin.token");
      sessionStorage.removeItem("fastcart.admin.user");
      state.token = null;
      state.userName = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.userName = action.payload.userName;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Could not sign in. Please try again.";
    });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
