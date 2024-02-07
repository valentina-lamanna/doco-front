import React, { useReducer, useEffect, createContext } from "react";
import { userReducer, initialState } from "./useReducer";

import Cookies from "js-cookie";

interface UserContextValue {
  state: any;
  dispatch: any;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, getInitialUserState());

  useEffect(() => {
    // Almacenar el estado en Session Storage
    Cookies.set("userState", JSON.stringify(state));
  }, [state]);

  function getInitialUserState() {
    try {
      const storedState = Cookies.get("userState");
      return storedState ? JSON.parse(storedState) : initialState;
    } catch (error) {
      console.error("Error al acceder al sessionStorage:", error);
      return initialState;
    }
  }
  useEffect(() => {
    try {
      const storedState = Cookies.get("userState");
      if (storedState !== "null") {
        dispatch({ type: "LOGIN", payload: JSON.parse(storedState) });
      }
    } catch (error) {
      console.error("Error al acceder al sessionStorage:", error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
