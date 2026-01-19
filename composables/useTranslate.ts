export const useGetTranslation = (data: any): string => {
  const { locale } = useI18n();
  const currentLang = computed(() => locale.value);

  if (data?.[currentLang.value]) {
    return data[currentLang.value];
  }

  // if (data?.['uz']) {
  //   return data['uz'];
  // }

  // const keys = Object.keys(data || {});
  // if (keys.length > 0) {
  //   return data[keys[0]];
  // }

  return "";
};
