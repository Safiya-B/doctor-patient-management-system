import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";
import { FcEndCall } from "react-icons/fc";

const override = css`
  display: block;
  margin: 0 auto;
`;

const useStyles = (theme) => ({
  gridLoadContainer: {
    borderRadius: "4px 4px 0px 0",
    boxShadow: "0 0.1875rem 1.5rem rgb(0 0 0 / 20%)",
  },
  leftItem: {
    [theme.breakpoints.up("sm")]: {
      paddingRight: "20px",
    },
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "70vh",
  },
  loadContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  waitingText: {
    marginTop: "15px",
    textAlign: "center",
    color: "white",
  },
  leaveCallIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
const LoadingVideo = ({ room, disconnected }) => {
  const classes = useStyles();

  useEffect(() => {
    console.log("from loadingVideo", room, disconnected);
  }, [room, disconnected]);

  return (
    <Grid item xs={12} sm={8} md={8} lg={6} className={classes.leftItem}>
      <Grid container className={classes.gridLoadContainer}>
        <Grid item xs={12} className={classes.gridItem}>
          {disconnected ? (
            <div className={classes.leaveCallIcon}>
              <FcEndCall size="50px" />
            </div>
          ) : (
            <PuffLoader css={override} color="white" size="150px" />
          )}
          <Typography variant="body2" classes={{ root: classes.waitingText }}>
            {disconnected
              ? "Le participant a quitté l'appel"
              : "participant en attente"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoadingVideo;
