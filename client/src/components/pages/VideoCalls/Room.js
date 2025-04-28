import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";

import Participant from "./Participant";
import LoadingVideo from "./LoadingVideo";
import VideoAppBar from "./VideoAppBar";
import axios from "../../../api/axios";

const useStyles = (theme) => ({
  gridContainer: {
    padding: "20px",
    [theme.breakpoints.down("xs")]: {
      padding: "0px",
    },
    //minHeight: "100vh",
  },
  container: {
    flexWrap: "wrap-reverse",
  },

  main: {
    backgroundColor: "#263238",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
    },
  },
});

const Room = ({ room }) => {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);
  const [disconnected, setDisconnected] = useState(false);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);

  useEffect(() => {
    if (room) {
      const participantConnected = (participant) => {
        setParticipants((prevParticipants) => [
          ...prevParticipants,
          participant,
        ]);
      };

      const participantDisconnected = (participant) => {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p !== participant)
        );
        setDisconnected(true);
      };

      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
      return () => {
        room.off("participantConnected", participantConnected);
        room.off("participantDisconnected", participantDisconnected);
      };
    }
  }, [room]);

  useEffect(() => {
    console.log("participants :", participants);
  }, [participants]);

  const handleToggleCam = () => {
    room.localParticipant.videoTracks.forEach((publication) => {
      if (publication.track.isEnabled) {
        console.log("disable camera");
        publication.track.disable();
      } else {
        console.log("enable camera");
        publication.track.enable();
      }
      setToggleVideo(publication.track.isEnabled);
    });
  };

  const handleToggleMic = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      if (publication.track.isEnabled) {
        console.log("disable camera");
        publication.track.disable();
      } else {
        console.log("enable camera");
        publication.track.enable();
      }
      setToggleAudio(publication.track.isEnabled);
    });
  };

  const remoteParticipants = participants.map((participant) => (
    <Participant
      participant={participant}
      key={participant.sid}
      room={room}
      remote={true}
    />
  ));
  return (
    <div className={classes.main}>
      <Grid
        container
        className={classes.gridContainer}
        classes={{ container: classes.container }}
        justifyContent="center"
      >
        {participants.length === 0 ? (
          <LoadingVideo room={room} disconnected={disconnected} />
        ) : (
          remoteParticipants
        )}
        <Participant
          remote={false}
          participant={room.localParticipant}
          room={room}
        />
        <VideoAppBar
          audio={toggleAudio}
          video={toggleVideo}
          handleToggleMic={handleToggleMic}
          handleToggleCam={handleToggleCam}
        />
      </Grid>
    </div>
  );
};

export default Room;
