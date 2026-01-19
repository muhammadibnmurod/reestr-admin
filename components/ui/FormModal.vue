<template>
  <el-dialog
    v-model="model"
    :title="title"
    :width="width"
    close-on-click-modal
    destroy-on-close
    align-center
  >
    <slot></slot>

    <template #footer>
      <el-button :disabled="saving" size="large" @click="onCancel">
        {{ $t("actions.cancel") }}
      </el-button>

      <el-button
        v-if="
          hideSave == false || (hideSave == undefined && mode != FormMode.VIEW)
        "
        :disabled="saving"
        :loading="saving"
        type="primary"
        size="large"
        @click="onSubmit"
      >
        {{ finalSaveText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { FormMode } from "@/composables/useFormDialog"; // yoki ~/composables/useFormDialog

type Props = {
  title: string;
  saving?: boolean;
  width?: number;
  saveText?: string;
  hideSave?: boolean;
  mode?: FormMode;
};

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  hideSave: undefined,
  saveText: undefined,
});

const model = defineModel<boolean>();

const finalSaveText = computed(
  () =>
    props.saveText ??
    (props.mode === FormMode.EDIT ? t("actions.update") : t("actions.save")),
);

const emit = defineEmits(["cancel", "submit"]);

const onCancel = () => {
  emit("cancel");
  model.value = false;
};

const onSubmit = () => {
  emit("submit");
};
</script>

<style lang="css">
:root {
  .el-dialog {
    --el-dialog-border-radius: 16px;
    --el-dialog-padding-primary: 24px;
    --el-text-color-primary: var(--primary-color);
  }
}
</style>

<style lang="css">
.el-dialog {
  @apply flex flex-col gap-2 lg:max-h-[calc(100vh-80px)];
  /* use CSS variable for border color; provide a sensible fallback */
  border: 1px solid var(--surface-30, #e5e7eb);
}

.el-dialog__header {
  @apply pb-2 flex items-center;
}

.el-dialog__title {
  @apply font-semibold;
}

.el-dialog__headerbtn {
  @apply top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full;
  /* background and border use CSS variables so theme can override them; fallbacks provided */
  background: var(--surface-40, #f8fafb);
  border: 1px solid var(--surface-30, #e5e7eb);
}

.el-dialog__headerbtn .el-dialog__close {
  @apply text-2xl;
  color: var(--primary-color, #2563eb);
}
</style>
