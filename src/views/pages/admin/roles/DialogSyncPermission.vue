<template>
  <Dialog
    :header="`${$t('role_sync_permission')}: ${item.name}`"
    v-model:visible="display"
    style="width: 1200px"
    class="h-full"
    contentClass="flex flex-column h-full overflow-hidden"
    :modal="true"
    @hide="emit('close')"
  >
    <div class="flex h-full gap-3">
      <div class="w-full h-full flex flex-column gap-3">
        <div class="flex gap-3">
          <IconField iconPosition="left" class="w-full">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText class="w-full surface-100" type="text" v-model="s.left" :placeholder="$t('search')" />
          </IconField>
        </div>
        <div class="border-round border-1 border-200 h-full overflow-auto">
          <DataTable :value="getLeftPermissions" :loading="loading.left">
            <template #empty>
              <div class="text-center">{{ $t("no_data") }}</div>
            </template>
            <Column field="translation" :header="$t('permissions')" class="p-2">
              <template #body="{ data }">
                <p class="m-0">{{ data.translation }}</p>
                <span class="text-sm text-400">{{ data.name }}</span>
              </template>
            </Column>
            <Column field="action" class="w-3rem p-1">
              <template #body="{ data }">
                <Button icon="pi pi-plus-circle" size="small" text rounded @click="addPermission(data)" />
              </template>
            </Column>
          </DataTable>
          <div class="last-item pb-1"></div>
        </div>
      </div>
      <Divider layout="vertical" align="center" class="m-0">
        <Button icon="pi pi-angle-double-right" class="-mt-1 -mx-2" size="small" text rounded @click="addAllItems" />
        <Button icon="pi pi-angle-double-left" class="-my-1 -mx-2" size="small" text rounded @click="removeAllItems" />
      </Divider>
      <div class="w-full h-full flex flex-column gap-3">
        <div class="flex">
          <IconField iconPosition="left" class="w-full">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText class="w-full surface-100" type="text" v-model="s.right" :placeholder="$t('search')" />
          </IconField>
        </div>
        <div class="border-round border-1 border-200 h-full overflow-hidden">
          <DataTable :value="getRightPermissions" scrollable :loading="loading.right" class="flex flex-column h-full">
            <template #empty>
              <div class="text-center">{{ $t("no_data") }}</div>
            </template>
            <Column field="action" class="w-3rem p-1">
              <template #body="{ data, index }">
                <Button icon="pi pi-minus-circle" size="small" severity="danger" text rounded @click="role_permission.splice(index, 1)" />
              </template>
            </Column>
            <Column field="translation" :header="$t('role_permissions')" class="p-2">
              <template #body="{ data }">
                <p class="m-0">{{ data.translation }}</p>
                <span class="text-sm text-400">{{ data.name }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <template #footer>
      <Button :label="$t('cancel')" :loading="loading.save" severity="secondary" @click="emit('close')" text />
      <Button :label="$t('save')" :loading="loading.save" @click="save()" />
    </template>
  </Dialog>
</template>

<script setup>
import { $t } from "@/stores/helper";
import { useQueryClient } from "@tanstack/vue-query";
import { ref, toRefs, computed, onMounted } from "vue";
import { getRequest, putRequest } from "@/stores/request";
import { Dialog, Divider, IconField, InputIcon } from "primevue";

const queryClient = useQueryClient();

const props = defineProps({
  item: { type: Object, default: () => ({}) },
});
const { item } = toRefs(props);
const emit = defineEmits(["close", "save"]);

const s = ref({ left: "", right: "" });
const meta = ref({ current_page: 0, last_page: 1 });
const display = ref(true);
const loading = ref({ left: false, right: false, save: false });
const permissions = ref([]);

const role_permission = ref([...item.value.permissions]);

const getLeftPermissions = computed(() => {
  let items = permissions.value.filter((v) => !role_permission.value.find((va) => va.name == v.name));
  if (s.value.left) items = items.filter((v) => v.name?.toLowerCase().includes(s.value.left.toLowerCase()));
  return items;
});
const getRightPermissions = computed(() => {
  let items = role_permission.value;
  if (s.value.right) items = items.filter((v) => v.name?.toLowerCase().includes(s.value.right.toLowerCase()));
  return items;
});

const getList = () => {
  loading.value.left = true;
  getRequest(`auth/permission?page=${meta.value.current_page}&rows=50`)
    .then((res) => {
      permissions.value = permissions.value.concat(res.data.filter((v) => !permissions.value.find((va) => va.name == v.name)));
      meta.value = res.meta;
      if (getLeftPermissions.value.length < 15) nextPage();
    })
    .finally(() => (loading.value.left = false));
};
const addPermission = (permission) => {
  role_permission.value.push(permission);
};
const save = () => {
  loading.value.save = true;
  let data = { ...props.item, permissions: role_permission.value.map((v) => v.name) };
  putRequest(`auth/role/${props.item.id}`, data)
    .then(() => {
      emit("close");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    })
    .finally(() => (loading.value.save = false));
};
const nextPage = () => {
  if (meta.value.current_page == meta.value.last_page) return;
  meta.value.current_page++;
  getList();
};
const intersectionObserver = () => {
  let options = { root: null, rootMargin: "0px", threshold: 0 };
  let observer = new IntersectionObserver((entries) => {
    if (!entries.length) return;
    if (entries[0].isIntersecting) nextPage();
  }, options);
  observer.observe(document.querySelector(".last-item"));
};
const addAllItems = () => {
  role_permission.value = [...role_permission.value, ...getLeftPermissions.value];
};
const removeAllItems = () => {
  role_permission.value = role_permission.value.filter((v) => !getRightPermissions.value.find((va) => va.name == v.name));
};

onMounted(() => setTimeout(() => intersectionObserver(), 100));
</script>
