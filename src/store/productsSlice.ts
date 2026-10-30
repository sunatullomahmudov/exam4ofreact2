import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/client";

type Product = {
  id: number;
  productName: string;
  image: string;
  categoryName: string;
  price: number;
  quantity: number;
};

type ProductsResponse = {
  totalPage: number;
  totalRecord: number;
  data: { products: Product[] };
};

type ProductsState = {
  items: Product[];
  totalPage: number;
  totalRecord: number;
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
};

const initialState: ProductsState = {
  items: [],
  totalPage: 0,
  totalRecord: 0,
  isLoading: false,
  error: null,
  requestId: null,
};

export const getProducts = createAsyncThunk("products/getProducts", async ({ page, search }: { page: number; search: string }) => {
  const response = await api.get<ProductsResponse>("/Product/get-products", {
    params: {
      PageNumber: page,
      PageSize: 10,
      ProductName: search || undefined,
    },
  });
  return response.data;
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: number) => {
  await api.delete("/Product/delete-product", { params: { id } });
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.requestId = action.meta.requestId;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.items = action.payload.data.products;
      state.totalPage = action.payload.totalPage;
      state.totalRecord = action.payload.totalRecord;
      state.requestId = null;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false;
      state.error = "Unable to load products. Please try again.";
      state.requestId = null;
    });
  },
});

export default productsSlice.reducer;
