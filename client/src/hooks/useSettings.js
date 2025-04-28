import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const useSettings = () => {
  const [initialSettings, setInitialSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const fetchSettingsData = async () => {
      try {
        const { data } = await axios.get("/api/appointments/settings");
        !ignore && setInitialSettings(data.settings[0]);
      } catch (error) {
        console.log(error.response);
      }
      setLoading(false);
    };

    fetchSettingsData();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  return { initialSettings, loading };
};

export default useSettings;
