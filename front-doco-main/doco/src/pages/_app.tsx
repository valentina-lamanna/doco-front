import React from "react";
import Layout from "../components/Layout";
import { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Head from "next/head";
import useI18n from "../hooks/useI18n";
import { TranslationContextProvider } from "../contexts/translationProvider";
import { useRouter } from "next/router";
import theme from "../config/theme";
import createEmotionCache from "../config/createEmotionCache";
import { ProvideDoco } from "../contexts/provideDoco";
import dynamic from "next/dynamic";
import { UserConfig, appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";

const UserProvider = dynamic(() => import("../contexts/userProvider"), {
  ssr: false,
});

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

type I18N = (key: string, interpolation?: Record<string, string>) => string;

const MyApp = (props: MyAppProps) => {
  const clientSideEmotionCache = createEmotionCache();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const i18nDoco = useI18n("doco").i18n;
  const router = useRouter();
  const locale = router.locale;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/logo_doco.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TranslationContextProvider i18n={i18nDoco} locale={locale}>
          <ProvideDoco>
            <UserProvider>
              <Layout props={props}>
                <Component {...pageProps} />
              </Layout>
            </UserProvider>
          </ProvideDoco>
        </TranslationContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig as UserConfig);
