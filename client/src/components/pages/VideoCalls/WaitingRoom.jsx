import React, { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button, Typography, Grid, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";
import Webcam from "react-webcam";
import { BsFillSquareFill } from "react-icons/bs";

const useStyles = (theme) => ({
  cardMedia: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    [theme.breakpoints.between("sm", "xl")]: {
      borderRadius: "4px 0px 0px 4px",
    },
    [theme.breakpoints.down("xs")]: {
      borderRadius: "4px 4px 0px 0px",
    },
  },
  cardContent: {
    padding: "50px",
    [theme.breakpoints.between("xs", "sm")]: {
      padding: "20px",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  cardTitle: {
    marginBottom: "15px",
  },
  gridContainer: {
    padding: "20px",
    minHeight: "100vh",
  },
  cardContainer: {
    boxShadow: "0 0.1875rem 1.5rem rgb(0 0 0 / 20%)",
    borderRadius: "4px",
  },
  micAccordion: {
    margin: "20px 0 20px 0",
  },
  test: {
    cursor: "pointer",
    color: "#3f51b5",
    "&:hover": {
      color: "#3f51b5e8",
    },
  },
  h5: {
    fontWeight: "100",
  },
  joinBtn: {
    marginTop: "20px",
  },
  audioDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  audioPlayer: {
    marginLeft: "10px",
    width: "100%",
  },
  disableBefore: {
    "&:before": {
      display: "none",
    },
  },

  micIcon: {
    fontSize: "28px",
  },
  stopBtn: {
    "&:hover": {
      backgroundColor: "#ef4d4d0f",
    },
    backgroundColor: "#ef4d4d0f",
    padding: "18px",
  },
  stopIcon: {
    color: "#e85757",
    fontSize: "20px",
  },
  loading: {
    padding: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const WaitingRoom = ({ handleSubmit, connexion }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { status, startRecording, stopRecording, mediaBlobUrl, error } =
    useReactMediaRecorder({ audio: true, askPermissionOnMount: true });

  return (
    <Grid
      container
      className={classes.gridContainer}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} md={8} className={classes.mainItem}>
        <Grid container className={classes.cardContainer}>
          <Grid item xs={12} sm={6}>
            {loading && (
              <div className={classes.loading}>
                <ClipLoader
                  color={"grey"}
                  loading={loading}
                  size={50}
                  speedMultiplier={0.3}
                />
              </div>
            )}
            <Webcam
              className={classes.cardMedia}
              onCanPlay={() => setLoading(false)}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.cardContent}>
            <div>
              <Typography variant="h4" className={classes.cardTitle}>
                Bienvenue
              </Typography>
              <Typography>
                Avant de rejoindre la téléconsultation, vérifiez que votre
                caméra ainsi que votre micro fonctionnent.
              </Typography>
            </div>
            <Accordion
              className={classes.micAccordion}
              classes={{ root: classes.disableBefore }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Tester mon microphone</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {status === "recording" ? (
                  <IconButton
                    onClick={stopRecording}
                    classes={{ root: classes.stopBtn }}
                    disableRipple={true}
                  >
                    <BsFillSquareFill className={classes.stopIcon} />
                  </IconButton>
                ) : (
                  <IconButton color="primary" onClick={startRecording}>
                    <MicIcon classes={{ root: classes.micIcon }} />
                  </IconButton>
                )}

                <audio
                  src={mediaBlobUrl}
                  className={classes.audioPlayer}
                  controls
                />
              </AccordionDetails>
              {error !== "" && (
                <AccordionDetails>
                  <p style={{ color: "red" }}>err</p>
                </AccordionDetails>
              )}
            </Accordion>
            <Button
              color="primary"
              variant="outlined"
              disabled={connexion}
              className={classes.joinBtn}
              onClick={handleSubmit}
            >
              {connexion ? "...connexion" : " Rejoindre La Téléconsultation"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WaitingRoom;
