<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <el-table
      :data="projects"
      v-loading="loading"
      stripe
      height="calc(100vh - 260px)"
    >
      <el-table-column type="index" label="#" width="60" />

      <el-table-column
        label="Logo"
        width="120"
        align="center"
        class="dark:bg-black"
      >
        <template #default="{ row }">
          <el-image
            :src="getImage(row.logo)"
            :preview-src-list="[getImage(row.logo)]"
            fit="cover"
            class="w-20 rounded cursor-pointer"
            preview-teleported
          />
        </template>
      </el-table-column>

      <el-table-column prop="nameUz" label="Nomi" min-width="200" />

      <el-table-column label="Progress" width="140">
        <template #default="{ row }">
          <el-progress :percentage="row.completionPercent" />
        </template>
      </el-table-column>

      <el-table-column label="PM" min-width="250">
        <template #default="{ row }">
          <div class="flex items-center gap-2 w-72">
            <el-image
              :src="getImage(row.pm?.image)"
              :preview-src-list="[getImage(row.pm?.image)]"
              fit="cover"
              class="w-10 h-10 rounded-full cursor-pointer"
            />

            <div class="text-sm">{{ row.pm?.fullNameUz }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Muddat" width="250">
        <template #default="{ row }">
          {{ row.startDate }} → {{ row.endDate }}
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="190" fixed="right" align="center">
        <template #default="{ row }">
          <div class="flex justify-center gap-2 pr-8">
            <!-- VIEW -->
            <el-tooltip content="Ko‘rish" placement="top">
              <el-button
                type="primary"
                :icon="View"
                circle
                plain
                class="w-10 h-10"
                @click="$emit('view', row)"
              />
            </el-tooltip>

            <!-- EDIT -->
            <el-tooltip content="Tahrirlash" placement="top">
              <el-button
                type="warning"
                circle
                :icon="Edit"
                plain
                class="w-10 h-10"
                @click="$emit('edit', row)"
              />
            </el-tooltip>

            <!-- DELETE -->
            <el-tooltip content="O‘chirish" placement="top">
              <el-button
                type="danger"
                circle
                :icon="Delete"
                plain
                class="w-10 h-10"
                @click="$emit('delete', row)"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end p-4 border-t">
      <el-pagination
        v-model:current-page="pageModel"
        v-model:page-size="sizeModel"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Edit, View, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  projects: any[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits([
  "page-change",
  "size-change",
  "view",
  "edit",
  "delete",
]);

const pageModel = computed({
  get: () => props.currentPage,
  set: (v) => emit("page-change", v),
});

const sizeModel = computed({
  get: () => props.pageSize,
  set: (v) => emit("size-change", v),
});

const getImage = (path?: string) =>
  path && path !== "none" ? `https://reestr.das-uty.uz/api/${path}` : "";
</script>
