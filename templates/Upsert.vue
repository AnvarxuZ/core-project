<template>
  <Dialog v-model:visible="visible" modal :header="headText" :style="{ width: '30rem' }" @hide="emit('close')">
    <SkeletonUpsert v-if="isLoading" />
    <div v-else class="flex flex-column gap-3">
      <div class="flex flex-column gap-1">
        <label for="name">{{ $t("name") }} <span class="text-red-600">*</span> </label>
        <InputText
          id="name"
          class="w-full"
          variant="filled"
          v-model="form.name"
          :class="{ 'p-invalid': v$.form.name.$error }"
          :placeholder="$t('enter_name')"
        />
        <Message v-if="v$.form.name.$error" severity="error" size="small" variant="simple">{{ $errMes(v$.form.name) }}</Message>
      </div>
    </div>

    <template #footer>
      <Button :loading="loading" :label="$t('close')" outlined severity="secondary" @click="emit('close')" />
      <Button :loading="loading" :label="$t('save')" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { $t, $errMes } from "@/stores/helper";
import { required } from "@vuelidate/validators";
import { Dialog, Message, useToast } from "primevue";
import { ref, toRefs, computed, onMounted } from "vue";
import { getRequest, postRequest, putRequest } from "@/stores/request";
import useVuelidate from "@vuelidate/core";
import SkeletonUpsert from "@/components/SkeletonUpsert.vue";

const toast = useToast();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);
const emit = defineEmits(["save", "close"]);

const form = ref({});
const visible = ref(true);
const loading = ref(false);
const isLoading = ref(false);

const roles = computed(() => ({ form: { name: { required } } }));
const headText = computed(() => $t(`${item.value?.id ? "edit" : "add"}_$SNAKE_NAME$`));

const v$ = useVuelidate(roles, { form });

const fetchData = async () => {
  isLoading.value = true;
  form.value = await getRequest(`admin/$KEBAB_NAME$/${item.value?.id}`);
  isLoading.value = false;
};
const save = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  loading.value = true;
  let data = { ...form.value };
  try {
    let res = item.value?.id
      ? await putRequest(`admin/$KEBAB_NAME$/${item.value?.id}`, data)
      : await postRequest("admin/$KEBAB_NAME$", data);
    toast.add({ severity: "success", summary: $t("successfully_saved"), life: 3000 });
    emit("save", res);
    emit("close");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (item.value.id) fetchData();
});
</script>
