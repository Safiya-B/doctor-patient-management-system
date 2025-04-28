import React from "react";
import { Grid } from "@mui/material";

import useRequestParticipant from "../../../../hooks/useRequestParticipant";
import Loading from "../../Loading";
import PatientConsultTable from "./PatientConsultTable";
import UserCard from "../UserCard";

const useStyles = (theme) => ({
  gridContainer: {
    //paddingLeft: "10px",
    paddingTop: "100px",
  },
  cardPadding: {
    padding: "10px 0px 15px 15px",
  },
  cardMargin: {
    marginTop: "20px",
  },
  joinLink: {
    textDecoration: "none",
  },
  redButton: {
    color: "#f34f4f",
    border: "1px solid #f34f4fab",
    "&:hover": {
      color: "#f34f4f",
      border: " 1px solid #f34f4f",
    },
  },
});

const PatientConsultation = ({}) => {
  const classes = useStyles();
  const { participant, loadParticipant } = useRequestParticipant();

  return loadParticipant ? (
    <Loading />
  ) : (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8} xl={6}>
        <Grid container className={classes.gridContainer} spacing={4}>
          <Grid item xs={12}>
            <UserCard />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <PatientConsultTable rows={participant} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientConsultation;
