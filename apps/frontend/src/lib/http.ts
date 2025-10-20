import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., http://localhost:3000/api
  withCredentials: true, // Enable cookies for HTTPOnly authentication
  timeout: 15000,
});

// Request interceptor (thêm Authorization nếu có)
http.interceptors.request.use((config) => {
  // const token = authStore.getState().token; // nếu bạn có auth
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: chuẩn hoá lỗi
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const payload = err?.response?.data;
    const msg = Array.isArray(payload?.message)
      ? payload.message.join("; ")
      : payload?.message || err.message || "Request failed";
    // Có thể map code NestJS -> message thân thiện
    // Ví dụ dùng toast ở layer gọi
    return Promise.reject(new Error(msg));
  },
);
