<template>
  <div class="h-screen flex flex-column">
    <router-view />
  </div>

  <Toast />
  <ConfirmDialog />
</template>

<script setup>
import { useStore } from "./stores";
import { watch, computed } from "vue";
import { ConfirmDialog, Toast, useToast } from "primevue";
import { $t, getStorage, setStorage } from "./stores/helper";
import { useRouter } from "vue-router";
import { useLayoutConfigStore } from "./stores/layout_config";
import { useQuery } from "@tanstack/vue-query";
import { getRequest } from "./stores/request";

const store = useStore();
const toast = useToast();
const router = useRouter();
const { layoutState } = useLayoutConfigStore();

if (layoutState.darkMode) document.documentElement.classList.add("app-dark");
else document.documentElement.classList.remove("app-dark");

const serverErrors = computed(() => store.serverErrors);

watch(serverErrors, (value) => controlErrors(value), { deep: true });

const controlErrors = (value) => {
  let message = value.response?.data?.message.text || value.response?.data?.message || value.message;
  if (!value.status) return;
  if (value.status == 401) {
    store.logout();
    router.push({ name: "login" });
  }
  if (message) toast.add({ severity: "error", summary: $t("error"), detail: $t(message), life: 3000 });
  setTimeout(() => store.clearErrors(), 500);
};
// const { data: langs } = useQuery({
//   queryKey: ["publicLanguage"],
//   queryFn: async () => {
//     const l = await getRequest(`public/language`);
//     setStorage("langs", l.data || []);
//     return l.data;
//   },
//   retry: false,
// });
</script>
