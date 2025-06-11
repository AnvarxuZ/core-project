<template>
  <Dialog v-model:visible="visible" modal :header="$t('set_new_password')" :style="{ width: '25rem' }" @hide="emit('close')">
    <div class="flex flex-column gap-3">
      <div>{{ item.first_name }} {{ item.last_name }}</div>
      <div class="flex flex-column gap-1">
        <label for="password">{{ $t("password") }} <span class="text-red-600">*</span> </label>
        <IconField>
          <InputText
            id="password"
            class="w-full surface-100"
            v-model="password"
            :class="{ 'p-invalid': v$.password.$error }"
            :placeholder="$t('enter_password')"
          />
          <InputIcon class="pi pi-sync" @click="generate()" />
        </IconField>
        <Message v-if="v$.password.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.password) }}</Message>
      </div>
    </div>
    <template #footer>
      <Button :loading="loading" :label="$t('save')" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { $errMes, $t } from "@/stores/helper";
import { putRequest } from "@/stores/request";
import { required } from "@vuelidate/validators";
import { Dialog, IconField, InputIcon, Message, useToast } from "primevue";
import useVuelidate from "@vuelidate/core";

const toast = useToast();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);
const emit = defineEmits(["close"]);

const visible = ref(true);
const password = ref("");
const loading = ref(false);
const rules = ref({ password: { required } });

const v$ = useVuelidate(rules, { password });

const save = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  try {
    await putRequest(`auth/user-update-password/${item.value.id}`, { password: password.value });
    toast.add({ severity: "success", summary: $t("successfully_update"), life: 3000 });
    emit("close");
  } finally {
    loading.value = false;
  }
};
const generate = () => {
  password.value = Math.random().toString(36).slice(-8);
};
</script>
