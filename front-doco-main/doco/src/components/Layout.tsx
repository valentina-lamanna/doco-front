import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "./Navigation";
import { AlertInfo } from "./AlertInfo";
import { AlertSuccess } from "./AlertSuccess";
import { AlertError } from "./AlertError";
import useUserContext from "../hooks/useUserContext";
import { useRouter } from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useDocoContext from "../hooks/useDocoContext";
import {Loading} from "./loading";

const Layout = ({ children, props }) => {
  const { state } = useUserContext();
  const router = useRouter();
  let isLoggedIn = false;

  if (state) {
    isLoggedIn = state.isLogIn;
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/logIn");
    }
    if (isLoggedIn && router.pathname === '/') {
      router.push('/documentos');
    }
  }, [isLoggedIn]);

  console.log(state)
  console.log(router)

  return (
    <div>
      {router.route !== "/logIn" ? (
        <div>
          <ResponsiveAppBar {...props} />
          <div style={{ paddingTop: "3%" }}>
            <AlertInfo {...props} />
            <AlertError {...props} />
            <AlertSuccess {...props} />
            <div style={{ marginLeft: "50%" }}>
             <Loading></Loading>
           </div>
          </div>
        </div>
      ) : null}

      {children} {/*la pagina actual*/}
    </div>
  );
};

export default Layout;
