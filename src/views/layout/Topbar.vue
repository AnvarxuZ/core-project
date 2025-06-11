<template>
  <div class="h-4rem p-3 flex align-items-center justify-content-between border-bottom-1 border-100 surface-0">
    <div class="flex align-items-center gap-3">
      <Button :icon="`pi pi-${layoutState.isMenuActive ? 'chevron-left' : 'bars'}`" text rounded @click="onMenuToggle" />
      <p>{{ layoutState.activeMenu?.label || layoutState.activeModule?.label }}</p>
    </div>
    <div class="flex gap-2 align-items-center">
      <Button :icon="`pi pi-${layoutState.darkMode ? 'moon' : 'sun'}`" severity="secondary" text @click="changeSystemMode" />
      <KPIEmployee :employee="profile.employee" />
      <Button :icon="`pi pi-sign-out`" severity="secondary" text @click="onLogout" />
    </div>
  </div>
</template>

<script setup>
import { useLayoutStore } from "@/stores/layout";
import { useLayoutConfigStore } from "@/stores/layout_config";
import { useStore } from "@/stores";
import { useRouter } from "vue-router";
import KPIEmployee from "@/components/KPIEmployee.vue";

const { onMenuToggle, layoutState, changeSystemMode } = useLayoutConfigStore();
const { profile } = useLayoutStore();
const { logout } = useStore();
const router = useRouter();

const onLogout = () => {
  logout();
  router.push("/login");
};
</script>
