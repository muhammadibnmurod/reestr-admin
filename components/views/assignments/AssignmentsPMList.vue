<template>
  <div class="bg-white dark:bg-[#1e222b] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
    <el-table
      :data="pmData"
      stripe
      row-key="id"
      empty-text="PM biriktirilmagan"
      class="w-full"
      header-cell-class-name="tbl-head"
      :row-class-name="() => 'tbl-row'"
    >
      <!-- PM -->
      <el-table-column label="Project Manager" min-width="320">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <!-- avatar -->
            <el-image
              :src="getImageUrl(row.image)"
              fit="cover"
              class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden"
              preview-teleported
            >
              <template #error>
                <div
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800
                         flex items-center justify-center text-xs font-bold text-gray-500"
                >
                  PM
                </div>
              </template>
            </el-image>

            <!-- text -->
            <div class="min-w-0">
              <div class="font-semibold text-gray-900 dark:text-white truncate">
                {{
                  row.fullNameUz ||
                  row.fullNameEn ||
                  row.fullNameRu ||
                  row.fullNameKiril ||
                  "-"
                }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {{
                  row.positionUz ||
                  row.positionEn ||
                  row.positionRu ||
                  row.positionKiril ||
                  ""
                }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- ACTIONS -->
      <el-table-column label="Amallar" width="120" align="center">
        <template #default>
          <el-tooltip v-if="!readonly" content="Olib tashlash" placement="top">
            <el-button
              circle
              plain
              type="danger"
              :icon="Delete"
              class="w-10 h-10"
              @click="$emit('unassign-pm')"
            />
          </el-tooltip>
        </template>
      </el-table-column>

      <!-- EMPTY -->
      <template #empty>
        <div class="py-10 text-center">
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            PM biriktirilmagan
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            “PM biriktirish” tugmasidan foydalaning.
          </div>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  pm: any | null;
  readonly?: boolean;
}>();

defineEmits<{
  (e: "unassign-pm"): void;
}>();

const pmData = computed(() => (props.pm ? [props.pm] : []));

const getImageUrl = (path?: string) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `https://reestr.das-uty.uz/api/${path}`;
};
</script>

