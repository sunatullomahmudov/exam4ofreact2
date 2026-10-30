import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/client";

type Item = { id: number; name: string; image?: string };
type Category = { id: number; categoryName: string; categoryImage?: string };
type Brand = { id: number; brandName: string };
type OtherState = {
  items: Item[];
  totalPage: number;
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
};

const initialState: OtherState = {
  items: [],
  totalPage: 0,
  isLoading: false,
  error: null,
  requestId: null,
};

export const getOtherItems = createAsyncThunk("other/getItems", async ({ kind, page }: { kind: "categories" | "brands"; page: number }) => {
  if (kind === "categories") {
    const response = await api.get<{ data: Category[] }>("/Category/get-categories");
    return {
      items: response.data.data.map((item) => ({
        id: item.id,
        name: item.categoryName,
        image: item.categoryImage,
      })),
      totalPage: 1,
    };
  }
  const response = await api.get<{ data: Brand[]; totalPage: number }>("/Brand/get-brands", { params: { PageNumber: page, PageSize: 10 } });
  return {
    items: response.data.data.map((item) => ({
      id: item.id,
      name: item.brandName,
    })),
    totalPage: response.data.totalPage,
  };
});

const otherSlice = createSlice({
  name: "other",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOtherItems.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.items = [];
      state.requestId = action.meta.requestId;
    });
    builder.addCase(getOtherItems.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.items = action.payload.items;
      state.totalPage = action.payload.totalPage;
      state.requestId = null;
    });
    builder.addCase(getOtherItems.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.error = "Unable to load data. Please try again.";
      state.requestId = null;
    });
  },
});

export default otherSlice.reducer;
