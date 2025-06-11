<template>
  <Dialog v-model:visible="visible" modal :header="$t(headText)" :style="{ width: '25rem' }" @hide="emit('close')">
    <SkeletonUpsert v-if="isLoading" />
    <div v-else class="flex flex-column gap-3">
      <template v-if="!item?.id">
        <label for="employee">{{ $t("employee") }} <span class="text-red-600">*</span> </label>
      </template>
      <!-- <div class="flex flex-column gap-1">
        <label for="first_name">{{ $t("first_name") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="first_name"
          class="w-full surface-100"
          v-model="form.first_name"
          :class="{ 'p-invalid': v$.form.first_name.$error }"
          :placeholder="$t('enter_first_name')"
        />
        <Message v-if="v$.form.first_name.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.first_name) }}</Message>
      </div>
      <div class="flex flex-column gap-1">
        <label for="last_name">{{ $t("last_name") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="last_name"
          class="w-full surface-100"
          v-model="form.last_name"
          :class="{ 'p-invalid': v$.form.last_name.$error }"
          :placeholder="$t('enter_last_name')"
        />
        <Message v-if="v$.form.last_name.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.last_name) }}</Message>
      </div>
      <div class="flex flex-column gap-1">
        <label for="tabel">{{ $t("tabel") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="tabel"
          class="w-full surface-100"
          v-model="form.tabel"
          :class="{ 'p-invalid': v$.form.tabel.$error }"
          :placeholder="$t('enter_tabel')"
        />
        <Message v-if="v$.form.tabel.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.tabel) }}</Message>
      </div> -->
      <div class="flex flex-column gap-1">
        <label for="username">{{ $t("username") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="username"
          class="w-full surface-100"
          v-model="form.username"
          :class="{ 'p-invalid': v$.form.username.$error }"
          :placeholder="$t('enter_username')"
        />
        <Message v-if="v$.form.username.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.username) }}</Message>
      </div>
      <div v-if="!item?.id" class="flex flex-column gap-1">
        <label for="password">{{ $t("password") }} <span class="text-red-600">*</span> </label>
        <IconField>
          <InputText
            id="password"
            class="w-full surface-100"
            v-model="form.password"
            :class="{ 'p-invalid': v$.form.password.$error }"
            :placeholder="$t('enter_password')"
          />
          <InputIcon class="pi pi-sync cursor-pointer" v-tooltip.top="$t('generate_password')" @click="generate()" />
        </IconField>
        <Message v-if="v$.form.password.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.password) }}</Message>
      </div>
      <div class="flex flex-column gap-1">
        <div class="flex align-items-center">
          <Checkbox input-id="is_kpi_manager" v-model="form.is_kpi_manager" :binary="true" />
          <label for="is_kpi_manager" class="ml-2 line-clamp-1"> {{ $t("kpi_manager") }} </label>
        </div>
      </div>
    </div>
    <template #footer>
      <Button :loading="loading" :label="$t('save')" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { $errMes, $t } from "@/stores/helper";
import { required } from "@vuelidate/validators";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { Checkbox, Dialog, IconField, InputIcon, Message } from "primevue";
import { getRequest, postRequest, putRequest } from "@/stores/request";
import useVuelidate from "@vuelidate/core";
import SkeletonUpsert from "@/components/SkeletonUpsert.vue";

const queryClient = useQueryClient();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);

const emit = defineEmits(["close", "save"]);

const visible = ref(true);
const loading = ref(false);
const roles = computed(() => ({
  form: {
    // first_name: { required },
    // last_name: { required },
    // tabel: { required },
    username: { required },
    password: { required: item.value?.id ? {} : required },
  },
}));
const headText = computed(() => $t(`${item.value?.id ? "edit" : "add"}_user`));

const { data, isLoading } = useQuery({
  queryKey: ["userForm", item.value?.id || "new"],
  queryFn: async () => {
    let res = !!item.value?.id ? await getRequest(`auth/user/${item.value?.id}`) : {};
    form.value = { ...res, is_kpi_manager: res.employee?.is_kpi_manager || false };
    return res;
  },
});
const form = ref(item.value?.id ? { ...data.value } : {});
const v$ = useVuelidate(roles, { form });

const save = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  form.value.roles = [];
  try {
    let res = item.value?.id ? await putRequest(`auth/user/${item.value?.id}`, form.value) : await postRequest("auth/user", form.value);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  } finally {
    loading.value = false;
    emit("close");
  }
};
const generate = () => {
  form.value.password = Math.random().toString(36).slice(-8);
};
</script>
