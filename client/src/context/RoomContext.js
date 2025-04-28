import axios from "../api/axios";
import React, { useState, createContext, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";

export const RoomContext = createContext(null);

export const RoomProvider = ({ children, navigate }) => {
  const [rows, setRows] = useState({});
  const { auth } = useAuth();

  /*   useEffect(() => {
    //if (!isAuth()) navigate("/");

    const fetchRoomData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        };
        const updateParticipants = await axios.get(
          "/api/video/participant",
          config
        );
        const { data } = await axios.get("/api/video/participants", config);
        setRows(data);
      } catch (error) {

        console.log(error.response);
      }
    };
    fetchRoomData();
  }, [navigate]); */

  return (
    Object.entries(rows).length !== 0 && (
      <RoomContext.Provider value={[rows, setRows]}>
        {children}
      </RoomContext.Provider>
    )
  );
};
