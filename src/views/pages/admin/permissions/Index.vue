<template>
  <div class="h-full flex flex-column">
    <DataTable :value="getData" scrollable stripedRows :loading="isLoading" class="h-full flex flex-column overflow-hidden">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <div class="w-15rem">
            <InputText v-model="s" class="w-full" size="small" :placeholder="$t('search')" @input="getSearch" />
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-refresh" severity="secondary" @click="refresh" />
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
      <Column field="label" :header="$t('label')"> </Column>
      <Column field="name" :header="$t('name')"> </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { $t } from "@/stores/helper";
import { getRequest } from "@/stores/request";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { Paginator, ProgressBar } from "primevue";
import { computed } from "vue";

const queryClient = useQueryClient();

const s = ref("");
const sort = ref("id");
const timer = ref();
const paginate = ref({ from: 1, page: 1, perPage: 20, total: 0 });

const fetchData = async () => {
  let loc_query = `?sort=${sort.value}&s=${s.value}&page=${paginate.value.page}&rows=${paginate.value.perPage}`;
  const response = await getRequest(`auth/permission-list${loc_query}`);
  // paginate.value = {
  //   from: response.meta.from,
  //   page: response.meta.current_page,
  //   perPage: response.meta.per_page,
  //   total: response.meta.total,
  // };
  return response.permissions;
};
const { data, isLoading, refetch } = useQuery({
  queryKey: ["permissions"],
  queryFn: fetchData,
});

const getData = computed(() => {
  if (!data.value) return [];
  // s bo'yicha filterlash
  return data.value.filter((item) => {
    return item.label.toLowerCase().includes(s.value.toLowerCase()) || item.name.toLowerCase().includes(s.value.toLowerCase());
  });
});

const refresh = () => {
  s.value = "";
  queryClient.invalidateQueries({ queryKey: ["permissions"] });
};
const getSearch = () => {
  clearTimeout(timer.value);
  timer.value = setTimeout(() => queryClient.invalidateQueries({ queryKey: ["permissions"] }), 500);
};
const getPaginate = (event) => {
  paginate.value.page = event.page + 1;
  paginate.value.perPage = event.rows;
  refetch();
};
</script>
