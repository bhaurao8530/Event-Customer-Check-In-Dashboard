import api from "./axiosInstance";

export const loginApi = (data) => {
  return api.post("/login", data);
};