import axios from "axios";
import { getStorage } from "./helper";

axios.interceptors.request.use((config) => {
  const token = getStorage("access_token") || "";
  const address = getStorage("DeviceAddress") || "";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (address) config.headers['Device-Address'] = address;
  config.headers.Accept = config.headers.Accept || "application/json";
  config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
//   config.headers["timezone"] = new Date().getTimezoneOffset() / -60;
  config.baseURL = import.meta.env.VITE_BACKEND_URL;
  return config;
});

export default axios;
