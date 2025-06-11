<template>
  <div class="h-full flex flex-column">
    <DataTable :value="data" scrollable stripedRows :loading="isLoading" class="h-full flex flex-column overflow-hidden">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <p>{{ $t("language") }}</p>
          <div class="w-6">
            <InputText v-model="s" class="w-full" size="small" :placeholder="$t('search')" @input="getSearch" />
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-refresh" severity="secondary" @click="refresh" />
            <Button v-if="$assent('language-store')" icon="pi pi-plus-circle" :label="$t('add')" @click="addItem()" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="text-l text-center text-400">{{ $t("no_data") }}</div>
      </template>
      <template #loading>
        <div class="w-25rem surface-0 p-3 border-round shadow-8"><ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar></div>
      </template>
      <Column field="id" header="№" class="w-3rem">
        <template #body="{ index }">{{ index + paginate.from || 1 }}</template>
      </Column>
      <Column field="code" :header="$t('code')"> </Column>
      <Column field="name" :header="$t('name')"> </Column>
      <Column field="is_active" :header="$t('is_active')" class="py-1">
        <template #body="{ data }">
          <ToggleSwitch v-model="data.is_active" readonly />
        </template>
      </Column>
      <Column field="action" class="p-1 text-right w-3rem">
        <template #header> <i v-if="isFetching" class="pi pi-spin pi-spinner mx-auto"></i> </template>
        <template #body="{ data }">
          <div class="flex">
            <div v-if="$assent('language-update')" v-tooltip.bottom="$t('edit')">
              <Button icon="pi pi-pen-to-square" text rounded size="small" severity="info" @click="edit(data)" />
            </div>
            <div v-if="$assent('language-destroy')" v-tooltip.bottom="$t('delete')">
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="deleteConfirm(data)" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows="paginate.perPage" :totalRecords="paginate.total" :rowsPerPageOptions="[20, 50, 100]" @page="getPaginate" />
  </div>

  <UpsertLanguage v-if="dialog_upsert" :item="item" @close="dialog_upsert = false" @save="refetch" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref } from "vue";
import { $t, $assent } from "@/stores/helper";
import { getRequest, deleteRequest } from "@/stores/request";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ConfirmDialog, Paginator, ProgressBar, ToggleSwitch, useConfirm, useToast } from "primevue";
import UpsertLanguage from "./UpsertLanguage.vue";

const queryClient = useQueryClient();
const confirm = useConfirm();
const toast = useToast();

const s = ref("");
const sort = ref("id");
const item = ref({});
const dialog_upsert = ref(false);
const timer = ref();
const paginate = ref({ from: 1, page: 1, perPage: 20, total: 0 });

const fetchRoles = async () => {
  let loc_query = `?sort=${sort.value}&s=${s.value}&page=${paginate.value.page}&rows=${paginate.value.perPage}`;
  const response = await getRequest(`admin/language${loc_query}`);
  paginate.value = {
    from: response.meta.from,
    page: response.meta.current_page,
    perPage: response.meta.per_page,
    total: response.meta.total,
  };
  response.data.map((d) => (d.is_active = d.is_active ? true : false));
  return response.data;
};
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["permissions"],
  queryFn: fetchRoles,
});

const refresh = () => {
  s.value = "";
  queryClient.invalidateQueries({ queryKey: ["permissions"] });
};
const getSearch = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => queryClient.invalidateQueries({ queryKey: ["permissions"] }), 500);
};
const addItem = () => {
  item.value = {};
  dialog_upsert.value = true;
};
const edit = (data) => {
  item.value = data;
  dialog_upsert.value = true;
};
const deleteConfirm = (data) => {
  confirm.require({
    message: `${$t("do_you_want_to_delete_this_record")}?`,
    header: $t("confirm_delete"),
    icon: "pi pi-info-circle",
    rejectLabel: $t("cancel"),
    rejectProps: { label: $t("cancel"), severity: "secondary", outlined: true },
    acceptProps: { label: $t("delete"), severity: "danger" },
    accept: async () => {
      await deleteRequest(`admin/language/${data.id}`);
      toast.add({ severity: "success", summary: $t("successfully_deleted"), life: 3000 });
      refresh();
    },
  });
};
const getPaginate = (event) => {
  paginate.value.page = event.page + 1;
  paginate.value.perPage = event.rows;
  refetch();
};
</script>
