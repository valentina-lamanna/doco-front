import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
} from "react";

interface TranslationContextState {
  i18n: (text: string, context?: any) => string;
  locale: string;
}
const TranslationContext = createContext<TranslationContextState>(
  {} as TranslationContextState
);

export interface TranslationContextProviderProps {
  children: ReactNode;
  i18n?: (text: string) => string;
  locale?: string;
}

const i18nDefault = (args: string) => args;

const TranslationContextProvider: FC<TranslationContextProviderProps> = (
  props
) => {
  const { children, i18n, locale = "es" } = props;

  const value = useMemo(
    () => ({
      i18n: i18n || i18nDefault,
      locale,
    }),
    []
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationContextProvider"
    );
  }
  return context;
}

TranslationContextProvider.defaultProps = {
  i18n: i18nDefault,
  locale: "es",
};

export type { TranslationContextState };
export { useTranslationContext, TranslationContextProvider };
