import { useState, useEffect } from "react";
import axios from "../api/axios";

const useRequestParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loadParticipants, setLoadParticipants] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await axios.get("/api/video/participants");

        setParticipants(data);
      } catch (error) {
        console.log(error.response);
      }
      setLoadParticipants(false);
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    console.log("from participants", loadParticipants);
  }, [loadParticipants]);

  return { participants, loadParticipants };
};

export default useRequestParticipants;
