const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "pt"],
  },
  defaultNS: "doco",
  localePath: path.resolve("./public/locales"),
  localeStructure: "{{lng}}/{{ns}}",
  localeExtension: "json",
  serializeConfig: false,
  react: { useSuspense: false },
  nsSeparator: false,
};
