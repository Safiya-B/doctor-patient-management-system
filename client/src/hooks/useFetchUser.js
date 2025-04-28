import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import axios from "../api/axios";
import useUserData from "./useUserData";

const useFetchUser = (request) => {
  const { user, setUser } = useUserData();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/users/profile");
      console.log("from useFetch 1 user ", data);
      setUser(data);
    } catch (error) {
      setAuth({});
      console.log(error.response);
      navigate("/login");
    }
    setLoading(false);
  };

  useEffect(() => {
    request && fetchUser();
  }, [auth.accessToken]);

  return { user, loading, fetchUser };
};

export default useFetchUser;
