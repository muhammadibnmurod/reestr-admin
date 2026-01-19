export type Nullable<T> = null | T;

export type LangCode = "uz" | "kril" | "ru" | "en";

export type LangOption = {
  code: LangCode;
  name: string;
  flag: string;
};


export enum FormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
  VIEW = "VIEW",
}

export type LangOptions = Record<LangCode, LangOption>;

export type ApiQueryParams = Partial<Record<string, any>>;

export type TableColumn<T = any> = {
  prop: DotKeys<T> | (string & {});
  label: string;
  width?: number;
  minWidth?: number;
  showOverflowTooltip?: boolean;
};

export type DotKeys<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T]-?: K extends string
          ? NonNullable<T[K]> extends Array<infer U>
            ? `${K}` | `${K}.0.${DotKeys<U>}`
            : NonNullable<T[K]> extends Record<string, any>
              ? `${K}` | `${K}.${DotKeys<NonNullable<T[K]>>}`
              : `${K}`
          : never;
      }[keyof T]
    : never;
