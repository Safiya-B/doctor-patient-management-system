import { useState, useEffect } from "react";
import axios from "../api/axios";

const useRequestParticipant = () => {
  const [participant, setParticipant] = useState([]);
  const [loadParticipant, setLoadParticipant] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const { data } = await axios.get("/api/video/participant");

        setParticipant(data);
      } catch (error) {
        console.log(error.response);
      }
      setLoadParticipant(false);
    };

    fetchParticipant();
  }, []);

  useEffect(() => {
    console.log("from request participant", loadParticipant);
  }, [loadParticipant]);

  return { participant, loadParticipant };
};

export default useRequestParticipant;
