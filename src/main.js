import "./assets/css/style.css";
import 'primeicons/primeicons.css'
import "primeflex/primeflex.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Column from "primevue/column";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const queryClient = new QueryClient();

app.use(router);
app.use(createPinia());
app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: ".app-dark" } } });
app.use(VueQueryPlugin, { queryClient });
app.use(ConfirmationService);
app.use(ToastService);

app.component("Column", Column);
app.component("Button", Button);
app.component("DataTable", DataTable);
app.component("InputText", InputText);

app.directive("tooltip", Tooltip);

app.mount("#app");
