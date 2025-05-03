import React, { useCallback, useContext } from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";

import {
  VideocamOff,
  Videocam,
  MicOff,
  Mic,
  CallEnd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { VideoContext } from "../../../context/VideoContext";
import useFetchUser from "../../../hooks/useFetchUser";

const useStyles = (theme) => ({
  videoIcons: {
    color: "white",
    padding: "8px",
    backgroundColor: "#393E46",
    "&:hover": {
      backgroundColor: "#393e46bd",
    },
  },
  callIcon: {
    color: "white",
    padding: "8px",
    backgroundColor: "#d83838",
    "&:hover": {
      backgroundColor: "#ea6262",
    },
  },
});

const VideoAppBar = ({ handleToggleMic, handleToggleCam, audio, video }) => {
  const classes = useStyles();
  const [room, setRoom] = useContext(VideoContext);
  const navigate = useNavigate();

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

    navigate("/teleconsultation/fin");
  }, []);

  return (
    <AppBar
      position={"fixed"}
      style={{
        top: "auto",
        bottom: 0,
        backgroundColor: "#263238",
        borderRadius: "0 0 4px 4px",
        boxShadow: "0 0.1875rem 1.5rem rgb(0 0 0 / 20%)",
      }}
      elevation={0}
    >
      <Toolbar style={{ justifyContent: "space-evenly", padding: "10px" }}>
        <div onClick={handleToggleMic}>
          {audio ? (
            <IconButton classes={{ root: classes.videoIcons }}>
              <Mic />
            </IconButton>
          ) : (
            <IconButton classes={{ root: classes.videoIcons }}>
              <MicOff />
            </IconButton>
          )}
        </div>
        <IconButton classes={{ root: classes.callIcon }} onClick={handleLogOut}>
          <CallEnd />
        </IconButton>
        <div onClick={handleToggleCam}>
          {video ? (
            <IconButton classes={{ root: classes.videoIcons }}>
              <Videocam />
            </IconButton>
          ) : (
            <IconButton classes={{ root: classes.videoIcons }}>
              <VideocamOff />
            </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default VideoAppBar;
