/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const { i18n } = require("./next-i18next.config");
const nextConfiguration = {
  i18n,
};
const withTM = require("next-transpile-modules")([
  "@mui/material",
  "@mui/system",
  "@mui/icons-material", // If @mui/icons-material is being used
])({
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mui/styled-engine": "@mui/styled-engine-sc",
    };
    return config;
  },
});

module.exports = withPlugins([withTM], nextConfiguration);
