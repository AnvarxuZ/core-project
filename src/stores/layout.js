import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { getStorage, setStorage } from "./helper";
import { getRequest } from "./request";

export const useLayoutStore = defineStore("layout", () => {
  const profile = ref(getStorage("profile") || null);
  const serverErrors = ref(null);
  const roles = computed(() => profile.value?.roles || []);
  const permissions = computed(() => profile.value?.permissions || []);

  const getProfile = async () => {
    try {
      const res = await getRequest("auth/profile");
      profile.value = res;
      setStorage("profile", res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  const setServerError = (error) => {
    serverErrors.value = error;
  };

  return { profile, roles, permissions, serverErrors, getProfile, setServerError };
});
