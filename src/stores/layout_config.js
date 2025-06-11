import { defineStore } from "pinia";
import { reactive } from "vue";
import { getStorage, issetBool, setStorage } from "./helper";

export const useLayoutConfigStore = defineStore("layoutConfig", () => {
  const layoutState = reactive({
    isMenuActive: false,
    activeModule: getStorage("activeModule") || null,
    activeMenu: getStorage("activeMenu") || null,
    darkMode: issetBool(getStorage("darkMode")) ? getStorage("darkMode") : window.matchMedia("(prefers-color-scheme: dark)").matches,
  });

  const setActiveModule = (module) => {
    layoutState.activeModule = module;
    setStorage("activeModule", module);
  };
  const setActiveMenu = (menu) => {
    layoutState.activeMenu = menu;
    setStorage("activeMenu", menu);
  };
  const onMenuToggle = () => {
    layoutState.isMenuActive = !layoutState.isMenuActive;
  };

  const changeSystemMode = () => {
    layoutState.darkMode = !layoutState.darkMode;
    document.documentElement.classList.toggle("app-dark");
    setStorage("darkMode", layoutState.darkMode);
  };

  return {
    layoutState,
    setActiveModule,
    setActiveMenu,
    onMenuToggle,
    changeSystemMode,
  };
});
