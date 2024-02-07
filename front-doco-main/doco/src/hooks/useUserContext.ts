import { useContext } from "react";
import { UserContext } from "../contexts/userProvider";

const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(
      "useUserContext must be used within a OperatorContextProvider"
    );
  }

  return context;
};

export default useUserContext;
