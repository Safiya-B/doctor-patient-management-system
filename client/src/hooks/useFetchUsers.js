import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import { UsersContext } from "../context/UsersContext";

const useFetchUsers = () => {
  const { users, setUsers } = useContext(UsersContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axiosPrivate.get("/api/users");
      console.log("from useFetch users ", response.data.usersList);
      setUsers(response.data.usersList.filter((user) => !user.isAdmin));
    } catch (error) {
      setAuth({});
      console.log("Error:", error.response);
      navigate("/login");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  return { users, loading, setUsers, fetchUsers };
};

export default useFetchUsers;
