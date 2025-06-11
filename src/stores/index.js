import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useStore = defineStore("store", () => {
  const default_format_date = ref("ru-RU");
  const serverErrors = ref({});

  const setServerError = (error) => {
    serverErrors.value = error;
  };
  const logout = () => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    localStorage.clear();
    localStorage.setItem("darkMode", darkMode);
  };
  const clearErrors = () => {
    serverErrors.value = {};
  };

  return { default_format_date, serverErrors, setServerError, logout, clearErrors };
});
