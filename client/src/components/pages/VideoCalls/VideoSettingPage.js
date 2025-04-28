import React, { useCallback, useState, useContext, useEffect } from "react";
import axios from "../../../api/axios";
import Video from "twilio-video";
import WaitingRoom from "./WaitingRoom";
import useAuth from "../../../hooks/useAuth";
import { VideoContext } from "../../../context/VideoContext";
import Room from "./Room";
import { Navigate } from "react-router";
import useFetchUser from "../../../hooks/useFetchUser";

const VideoSettingPage = () => {
  const [room, setRoom] = useContext(VideoContext);
  const { user } = useFetchUser();
  const { auth } = useAuth();
  const [connexion, setConnexion] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    setConnexion(true);
    event.preventDefault();
    try {
      const bodyParameters = {
        id: user.id + "_" + user.lastName,
      };

      const { data } = await axios.post("/api/video/token", bodyParameters);
      Video.connect(data.jwt)
        .then((room) => {
          setConnexion(false);
          setRoom(room);
        })
        .catch((err) => {
          console.log(err);
          setConnexion(false);
        });
    } catch (error) {
      console.log(error?.response?.data?.error, auth);
    }
  }, []);

  const handleLogOut = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPublication) => {
          trackPublication.track.stop();
        });
        prevRoom.disconnect();
      }

      return null;
    });
  }, []);

  useEffect(() => {
    if (room) {
      console.log(room);
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogOut();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);

      return async () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogOut]);

  return user.waitingRoom || user.isAdmin ? (
    room ? (
      <Room room={room} handleLogOut={handleLogOut} />
    ) : (
      <WaitingRoom handleSubmit={handleSubmit} connexion={connexion} />
    )
  ) : (
    <Navigate to="/fin" />
  );
};

export default VideoSettingPage;
