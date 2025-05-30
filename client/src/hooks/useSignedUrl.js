// hooks/useSignedUrl.js
import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

export const useSignedUrl = ({ assetType }) => {
  const axiosPrivate = useAxiosPrivate();
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const { data } = await axiosPrivate.get(
          `/api/files/assets?type=${encodeURIComponent(assetType)}`
        );

        setFileUrl(data.url);
      } catch (error) {
        console.error(error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [assetType]);

  return { fileUrl, loading };
};
