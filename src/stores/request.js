import axios from "@/stores/axios";
import { useStore } from ".";
import { getStorage } from "./helper";

export const getRequest = async (url, isPublic = false) => {
  if (!getStorage("access_token") && !isPublic) {
    useStore().setServerError({ status: 401 });
    return false;
  }
  try {
    const response = await axios.get(`api/${url}`);
    return response.data;
  } catch (error) {
    useStore().setServerError(error);
    throw error; // Xatoni tashlab yuborish, shunda uni chaqirgan joyda ushlash mumkin
  }
};
export const postRequest = async (url, data) => {
  try {
    const response = await axios.post(`api/${url}`, data);
    return response.data;
  } catch (error) {
    useStore().setServerError(error);
    throw error;
  }
};
export const putRequest = async (url, data) => {
  try {
    const response = await axios.put(`api/${url}`, data);
    return response.data;
  } catch (error) {
    useStore().setServerError(error);
    throw error;
  }
};
export const deleteRequest = async (url) => {
  try {
    const response = await axios.delete(`api/${url}`);
    return response.data;
  } catch (error) {
    useStore().setServerError(error);
    throw error;
  }
};
export const postRequestFormData = async (url, data) => {
  try {
    const response = await axios.post(`api/${url}`, data, { headers: { "Content-Type": "multipart/form-data" } });
    return response.data;
  } catch (error) {
    useStore().setServerError(error);
    throw error;
  }
};
export const getBlobRequest = async (url) => {
  try {
    const response = await axios.get(`api/${url}`, { responseType: "blob" });
    return response;
  } catch (error) {
    useStore().setServerError(error);
    throw error;
  }
};
