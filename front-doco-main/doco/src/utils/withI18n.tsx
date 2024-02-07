import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const withI18n = async () => {
  return {
    props: {
      ...(await serverSideTranslations("es")),
    },
  };
};

export default withI18n;
