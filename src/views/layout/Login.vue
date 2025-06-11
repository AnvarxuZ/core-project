<template>
  <div class="h-screen flex">
    <div class="w-8 hero-banner"></div>
    <div class="w-4 flex flex-column align-items-center justify-content-center">
      <div class="w-8 flex flex-column gap-6">
        <p class="text-4xl text-center uppercase font-light">{{ $t("korxora_ichki_kpi_portali") }}</p>
        <div class="flex flex-column gap-4">
          <Message v-if="error" severity="error" class="mb-2" closable @close="error = null">{{ $t(error) }}</Message>
          <FloatLabel variant="on" class="w-full">
            <InputText id="username" v-model="username" class="w-full" />
            <label for="username">{{ $t("username") }}</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-full">
            <Password id="password" v-model="password" :feedback="false" toggleMask input-class="w-full" class="w-full" />
            <label for="password">{{ $t("password") }}</label>
          </FloatLabel>
          <Button :label="$t('login')" :loading="loading" class="w-full" @click="login" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { $t, setStorage } from "@/stores/helper";
import { FloatLabel, InputText, Message, Password } from "primevue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { computed } from "vue";
import { postRequest } from "@/stores/request";

const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);
const roles = computed(() => ({ username: { required }, password: { required } }));
const v$ = useVuelidate(roles, { username, password });

const login = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  try {
    let res = await postRequest("auth/login", { username: username.value, password: password.value });
    setStorage("access_token", res.access_token);
    router.options?.history?.state.back ? router.back() : router.push("/");
  } catch (e) {
    console.log("err -> ", e);
    error.value = e.response?.data?.message || e.message || $t("login_error");
  } finally {
    loading.value = false;
  }
};
</script>
