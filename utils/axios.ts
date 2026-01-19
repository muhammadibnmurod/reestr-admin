import axios from "axios";

const api = axios.create({
  baseURL: "https://reestr.das-uty.uz/api",
  // withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

// REQUEST interceptor - har so'rovda token qo'shish
api.interceptors.request.use(
  (config) => {
    // Cookie'dan token olish
    const token = getCookie("access_token");

    if (token) {
      // Authorization header ga qo'shish
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE interceptor - 401 xatolikni boshqarish (bitta yetarli)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token yaroqsiz - login ga yo'naltirish
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export default api;
