<template>
  <div class="h-full flex flex-column relative">
    <ProgressBar v-if="isFetching" class="absolute w-full z-1" mode="indeterminate" style="height: 4px"></ProgressBar>
    <DataTable
      :value="data"
      v-model:sortField="sort.field"
      v-model:sortOrder="sort.order"
      scrollable
      :loading="isLoading"
      selectionMode="single"
      class="h-full flex flex-column overflow-hidden"
      @sort="refetch"
    >
      <template #header>
        <div class="flex flex-wrap justify-content-between align-items-center gap-2">
          <p>{{ $t("$SNAKE_NAME$s") }}</p>
          <div class="w-6 flex gap-2 min-w-max justify-content-center">
            <FloatLabel variant="on" class="w-full min-w-max">
              <InputText id="search" v-model="s" class="w-full" size="small" @input="getSearch" />
              <label for="search">{{ $t("search") }}</label>
            </FloatLabel>
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-refresh" severity="secondary" @click="refresh" />
            <Button v-if="$assent('$SNAKE_NAME$-store')" icon="pi pi-plus-circle" :label="$t('add')" @click="addItem" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="text-l text-center text-400">{{ $t("no_data") }}</div>
      </template>
      <template #loading>
        <div class="w-25rem surface-0 p-3 border-round shadow-8">
          <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        </div>
      </template>
      <Column field="id" header="№" class="w-3rem">
        <template #body="{ index }">{{ index + paginate.from }}</template>
      </Column>
      <Column field="name" :header="$t('name')" sortable></Column>
      <Column field="action" class="p-1 w-3rem" frozen alignFrozen="right">
        <template #body="{ data }">
          <div class="flex">
            <div v-if="$assent('$SNAKE_NAME$-update')" v-tooltip.bottom="$t('edit')">
              <Button icon="pi pi-pen-to-square" text rounded size="small" severity="info" @click="edit(data)" />
            </div>
            <div v-if="$assent('$SNAKE_NAME$-destroy')" v-tooltip.bottom="$t('delete')">
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="deleteConfirm(data)" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows="paginate.perPage" :totalRecords="paginate.total" :rowsPerPageOptions="[20, 50, 100]" @page="getPaginate" />
  </div>

  <$UPSERT_COMPONENT$ v-if="dialog_upsert" :item="item" @save="refetch" @close="dialog_upsert = false" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { $assent, $t } from "../../../stores/helper";
import { deleteRequest, getRequest } from "../../../stores/request";
import { FloatLabel, Paginator, ProgressBar, useConfirm, useToast } from "primevue";
import $UPSERT_COMPONENT$ from "./$UPSERT_COMPONENT$.vue";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const s = ref("");
const item = ref({});
const sort = ref({});
const timer = ref(null);
const dialog_upsert = ref(false);
const paginate = ref({ from: 1, page: 1, perPage: 20, total: 0 });

const fetchData = async () => {
  let loc_query = `?s=${s.value}&page=${paginate.value.page}&rows=${paginate.value.perPage}`;
  if (sort.value.field) loc_query += `&sort=${sort.value.order == 1 ? "" : "-"}${sort.value.field}`;
  const response = await getRequest(`admin/$KEBAB_NAME$${loc_query}`);
  paginate.value = {
    from: response.meta.from,
    page: response.meta.current_page,
    perPage: response.meta.per_page,
    total: response.meta.total,
  };
  return response.data;
};
const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["$OBJECT_NAME$Data", s, sort],
  queryFn: fetchData,
  retry: false,
});

const refresh = () => {
  s.value = "";
  refetch();
};
const getSearch = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => refetch(), 500);
};
const getPaginate = (event) => {
  paginate.value.page = event.page + 1;
  paginate.value.perPage = event.rows;
  refetch();
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
      await deleteRequest(`admin/$KEBAB_NAME$/${data.id}`);
      toast.add({ severity: "success", summary: $t("successfully_deleted"), life: 3000 });
      refetch();
    },
  });
};
</script>
