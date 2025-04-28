import { useContext } from "react";
import useAuth from "./useAuth";
import { UserDataContext } from "../context/UserDataContext";
import { axiosPublic } from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { setUser } = useContext(UserDataContext);

  const refresh = async () => {
    const { data } = await axiosPublic.get("/api/auth/refresh");

    setAuth((prev) => ({
      ...prev,
      user: data.user,
      accessToken: data.accessToken,
    }));
    setUser(data.user);

    return data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
