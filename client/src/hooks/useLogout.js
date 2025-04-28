import useAuth from "./useAuth";
import { axiosPublic } from "../api/axios";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const data = await axiosPublic("api/auth/logout");

      console.log("from logout", data);
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default useLogout;
