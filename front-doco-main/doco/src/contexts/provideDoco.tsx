import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";
import theme from "../config/theme";

interface DocoContextValue {
  setAlertError: (alert: string) => void;
  alertError: string;
  alertInfo: string;
  setAlertInfo: (alert: string) => void;
  alertSuccess: string;
  setAlertSuccess: (alert: string) => void;
}

export const DocoContext = createContext<DocoContextValue | undefined>(
  undefined
);

export function ProvideDoco({ children }) {
  const doco = useProviderDoco();
  return <DocoContext.Provider value={doco}>{children}</DocoContext.Provider>;
}

function useProviderDoco() {
  const [alertInfo, setAlertInfo] = useState(null);
  const [alertSuccess, setAlertSuccess] = useState(null);
  const [alertError, setAlertError] = useState(null);
  const [docHistory, setDocHistory] = useState('')

  return {
    alertInfo,
    setAlertInfo,
    alertSuccess,
    setAlertSuccess,
    alertError,
    setAlertError,
    docHistory, setDocHistory
  }; // retorar las variables
}
