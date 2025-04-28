import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const useRequestUserAppointments = (url) => {
  const [appointments, setAppointments] = useState([]);
  const [loadAppointments, setLoadAppointments] = useState(true);

  const navigate = useNavigate();
  let ignore = false;

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get("/api/appointments/bookings");
      !ignore && setAppointments(data.appointments);
    } catch (error) {
      console.log(error.response);
    }
    setLoadAppointments(false);
  };

  useEffect(() => {
    fetchAppointments();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  return { appointments, loadAppointments, fetchAppointments };
};

export default useRequestUserAppointments;
