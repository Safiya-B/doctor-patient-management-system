import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRequestSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let ignore = false;

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get("/api/appointments/timeslots");
      !ignore && setTimeSlots(data);
    } catch (error) {
      console.log(error.response);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  return { timeSlots, loading, fetchSlots };
};

export default useRequestSlots;
