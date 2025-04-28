import { useContext } from "react";
import { UserDataContext } from "../context/UserDataContext";

const useUserData = () => {
  return useContext(UserDataContext);
};

export default useUserData;
