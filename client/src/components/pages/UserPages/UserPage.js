import React, { useContext } from "react";

import { Grid } from "@mui/material";
import Box from "./Box";
import UserFiles from "./UserFiles";
import Loading from "../../pages/Loading";
import useRequestParticipant from "../../../hooks/useRequestParticipant";
import useFetchUser from "../../../hooks/useFetchUser";

const useStyles = (theme) => ({
  gridContainer: {
    //paddingLeft: "10px",
    paddingTop: "100px",
  },
  gridSecondContainer: {
    paddingTop: "50px",
  },
});

const UserPage = () => {
  const classes = useStyles();
  const { user } = useFetchUser();
  const { participant, loadParticipant } = useRequestParticipant();

  return loadParticipant ? (
    <Loading />
  ) : (
    <div>
      <div>
        <Grid
          container
          justifyContent="center"
          className={classes.gridContainer}
          spacing={3}
        >
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Box
              title="Téléconsultations"
              number={participant.length}
              page="teleconsultations"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Box title="Rendez-vous" number="0" page="rendez-vous" />
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="center"
          className={classes.gridSecondContainer}
          spacing={3}
        >
          <Grid item xs={12} lg={8}>
            <UserFiles filesList={user.filesList} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UserPage;
