<template>
  <el-table :data="data" :empty-text="$t('data.empty')">
    <el-table-column label="№" :width="50" align="center">
      <template #default="scope">
        {{ (page - 1) * size + scope.$index + 1 }}
      </template>
    </el-table-column>

    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :show-overflow-tooltip="column.showOverflowTooltip ?? true"
    >
      <template #default="{ row }">
        <slot :name="column.prop" :row="(row as T)">
          {{ row[column.prop] }}
        </slot>
      </template>
    </el-table-column>

    <el-table-column
      v-if="actions && showAnyAction"
      :label="$t('columns.actions')"
      :width="actions.width"
      :min-width="actions.minWidth"
      fixed="right"
      align="center"
    >
      <template #default="{ row }">
        <div class="flex items-center justify-center gap-2">
          <button
            v-if="actions.view"
            class="w-8 h-8 flex items-center justify-center rounded-full"
            style="background: #487fff26"
            @click="$emit('view', row)"
          >
            <el-icon size="16" color="#487FFF">
              <el-icon-view />
            </el-icon>
          </button>

          <button
            v-if="
              (typeof actions.edit === 'function' ? actions.edit(row) : actions.edit) &&
              (row.canUpdate ?? true)
            "
            class="w-8 h-8 flex items-center justify-center rounded-full"
            style="background: rgba(46, 160, 67, 0.15)"
            @click="$emit('edit', row)"
          >
            <el-icon size="16" color="#027d3f">
              <el-icon-edit-pen />
            </el-icon>
          </button>

          <button
            v-if="
              (typeof actions.connect === 'function' ? actions.connect(row) : actions.connect) &&
              (row.canConnect ?? true)
            "
            class="w-8 h-8 flex items-center justify-center rounded-full"
            style="background: rgba(46, 160, 67, 0.15)"
            @click="$emit('connect', row)"
          >
            <el-icon size="16" color="#027d3f">
              <el-icon-link />
            </el-icon>
          </button>
          <slot name="extra-actions" :row="row"></slot>

          <button
            v-if="actions.download"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-green-600/15 text-green-600"
            @click="$emit('download', row)"
          >
            <el-icon size="16">
              <el-icon-download />
            </el-icon>
          </button>

          <ButtonDelete
            v-if="
              (typeof actions.delete === 'function' ? actions.delete(row) : actions.delete) &&
              (row.canDelete ?? true)
            "
            @delete="$emit('delete', row)"
          ></ButtonDelete>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn } from '@/types/common';

interface Actions {
  view?: boolean;
  edit?: boolean | ((row: T) => boolean);
  delete?: boolean | ((row: T) => boolean);
  connect?: boolean | ((row: T) => boolean);
  download?: boolean;
  width?: number;
  minWidth?: number;
}

type Props = {
  data?: T[];
  columns: Array<TableColumn<T>>;
  actions?: Actions;
  page?: number;
  size?: number;
};

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  size: 10,
  actions: undefined,
});

defineEmits(['view', 'edit', 'delete', 'download', 'connect']);

const showAnyAction = computed(
  () => props.actions && Object.values(props.actions).some(x => (typeof x === 'boolean' ? x : true))
);
</script>

<style lang="css">
:root {
  .el-table {
    /* --el-table-bg-color: none; */
    /* --el-table-tr-bg-color: none; */
    --el-table-row-hover-bg-color: var(--surface-30);
    --el-table-header-text-color: var(--primary-color);
    --el-table-text-color: var(--primary-color);
    --el-table-header-bg-color: var(--surface-30);
    --el-table-border-color: var(--surface-20);
  }
}
</style>

<style lang="css">
.el-table thead .el-table__cell {
  @apply border-t border-surface-20;
}

.el-table thead .el-table__cell:first-child {
  @apply rounded-l-lg border-l;
}

.el-table thead .el-table__cell:last-child {
  @apply rounded-r-lg border-r border-solid border-surface-20;
}

.el-table tbody .el-table__cell {
  @apply py-4 border-surface-30;
}

</style>
