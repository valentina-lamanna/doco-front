import { i18n, useTranslation } from "next-i18next";
import { initReactI18next } from 'react-i18next';

interface Resources {
  jsonEs: Record<string, string>;
  jsonEn: Record<string, string>;
  jsonPt: Record<string, string>;
}

// eslint-disable-next-line default-param-last

const useI18n = (module = "doco", resources?: Resources) => {
  const { jsonEs, jsonEn, jsonPt } = resources || {};
  const { t } = useTranslation(module);

  i18n?.addResourceBundle("es", module, jsonEs);
  i18n?.addResourceBundle("en", module, jsonEn);
  i18n?.addResourceBundle("pt", module, jsonPt);

  return { i18n: t };
};

export default useI18n;
