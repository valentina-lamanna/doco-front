import { useContext } from "react";
import { DocoContext } from "../contexts/provideDoco";

const useDocoContext = () => {
  const context = useContext(DocoContext);

  if (context === undefined) {
    throw new Error(
      "useDocoContext must be used within a OperatorContextProvider"
    );
  }

  return context;
};

export default useDocoContext;
