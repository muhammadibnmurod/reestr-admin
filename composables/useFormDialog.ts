import type { UnwrapRef } from 'vue';

export enum FormMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

type Form<T> = {
  visible: boolean;
  mode: FormMode;
  data: T;
};

export function useFormDialog<T>() {
  const form = reactive<Form<T>>({
    visible: false,
    mode: FormMode.CREATE,
    data: {} as T,
  });

  const onAdd = () => {
    form.data = {} as any;
    form.mode = FormMode.CREATE;
    form.visible = true;
  };

  const onEdit = (data: T) => {
    form.data = { ...data } as UnwrapRef<T>;
    form.mode = FormMode.EDIT;
    form.visible = true;
  };

  const onView = (data: T) => {
    form.data = { ...data } as UnwrapRef<T>;
    form.mode = FormMode.VIEW;
    form.visible = true;
  };

  return {
    form,
    onAdd,
    onEdit,
    onView,
  };
}
