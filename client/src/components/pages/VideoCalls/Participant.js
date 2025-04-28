import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";

import "./VideoAppBar";

const useStyles = (theme) => ({
  gridRemoteItem: {
    [theme.breakpoints.up("sm")]: {
      paddingRight: "20px",
    },
  },
  participantVideo: {
    width: "100%",
    objectFit: "cover",
    borderRadius: "4px",
    boxShadow: "0 0.1875rem 1.5rem rgb(0 0 0 / 20%)",
  },
  remoteVideo: {
    width: "100%",
    height: "80vh",
    objectFit: "cover",
    display: "block",
    borderRadius: "4px",
    [theme.breakpoints.down("xs")]: {
      height: "75vh",
    },
  },

  localContainer: {
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-end",
    },
  },

  participantName: {
    color: "#fff",
    position: "absolute",
    padding: "10px",
  },
});

const Participant = ({ participant, remote, room }) => {
  const classes = useStyles();
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return remote ? (
    <Grid item xs={12} sm={8} lg={9} className={classes.gridRemoteItem}>
      <Grid container justifyContent="flex-end">
        <Grid item xs={12} sm={12} lg={9}>
          <div className={classes.participantName}>
            {participant.identity.split("_")[1]}
          </div>
          <audio ref={audioRef} autoPlay={true} />
          <video
            ref={videoRef}
            autoPlay={true}
            className={classes.remoteVideo}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid item xs={12} sm={4} lg={3} className={classes.gridLocalItem}>
      <Grid container classes={{ container: classes.localContainer }}>
        <Grid item xs={6} sm={12} lg={8}>
          <div className={classes.participantName}>
            {participant.identity.split("_")[1]}
          </div>
          <audio ref={audioRef} autoPlay={true} muted={false} />
          <video
            ref={videoRef}
            autoPlay={true}
            className={classes.participantVideo}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Participant;
