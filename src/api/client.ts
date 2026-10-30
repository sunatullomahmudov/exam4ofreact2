import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://store-api.softclub.tj",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("fastcart.admin.token");
  if (token && config.url !== "/Account/login") config.headers.Authorization = `Bearer ${token}`;
  return config;
});
