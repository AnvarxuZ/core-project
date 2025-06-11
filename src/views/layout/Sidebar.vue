<template>
  <div class="layout-sidebar">
    <div class="w-5rem h-full border-right-1 border-100">
      <div class="w-full px-2 py-1" @click="router.push('/')">
        <img class="w-full p-1" src="@/assets/images/vertical_logo.png" alt="" />
      </div>
      <ul class="layout-module">
        <template v-for="(item, i) in modules.filter((m) => m.visible)" :key="item.key">
          <AppModuleItem :item="item" @click="selectModule(item)" />
        </template>
      </ul>
    </div>
    <div class="h-full border-right-1 border-100">
      <ul class="layout-menu">
        <li class="p-3">
          <p class="font-normal text-lg text-400 line-clamp-1">{{ item_module.label }}</p>
        </li>
        <template v-for="(item, i) in item_module?.items?.filter((i) => i.visible)" :key="item.key">
          <AppMenuItem :item="item" :module="item_module" />
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { $t, $assent } from "@/stores/helper";
import { useLayoutConfigStore } from "@/stores/layout_config";
import AppMenuItem from "./AppMenuItem.vue";
import AppModuleItem from "./AppModuleItem.vue";

const router = useRouter();
const { onMenuToggle, layoutState, setActiveModule } = useLayoutConfigStore();

const modules = computed(() => [
  {
    key: "admin",
    label: $t("admin_panel"),
    icon: "pi pi-lock",
    to: "/admin",
    visible: true,
    items: [
      { key: "user", label: $t("users"), to: "/admin/user", visible: $assent("user-index") },
      { key: "role", label: $t("roles"), to: "/admin/role", visible: $assent("role-index") },
      { key: "permission", label: $t("permissions"), to: "/admin/permission", visible: $assent("permission-index") },
      { key: "language", label: $t("languages"), to: "/admin/language", visible: $assent("language-index") },
      { key: "setting", label: $t("settings"), to: "/admin/setting", visible: $assent("company_setting-show") },
    ],
  },
  {
    key: "catalog",
    label: $t("catalog"),
    icon: "pi pi-book",
    to: "/catalog",
    visible: true,
  },
]);
const item_module = ref({ ...layoutState.activeModule });

const selectModule = (item) => {
  if (!item.items) {
    setActiveModule(item);
    router.push(item.to);
  } else {
    item_module.value = item;
    layoutState.isMenuActive = true;
  }
};
</script>
