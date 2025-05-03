import React from "react";

import AppointmentDialog from "./AppointmentDialog";
import UpcommingAppointments from "./UpcommingAppointments";
import { Grid } from "@mui/material";
import LastAppointments from "./LastAppointments";
import useRequestSlots from "../../../../hooks/useRequestSlots";
import useRequestUserAppointments from "../../../../hooks/useRequestUserAppointments";
import Loading from "../../Loading";

const useStyles = (theme) => ({
  root: {
    paddingTop: "100px",
  },
});

const PatientRendezVous = () => {
  const classes = useStyles();

  const { timeSlots, loading } = useRequestSlots();
  const { appointments, loadAppointments, fetchAppointments } =
    useRequestUserAppointments();

  return loading || loadAppointments ? (
    <Loading />
  ) : (
    <Grid container justifyContent="center" className={classes.root}>
      <Grid item xs={12} md={8} xl={6}>
        <Grid container className={classes.gridContainer} spacing={4}>
          <Grid item xs={12}>
            <AppointmentDialog fetchAppointments={fetchAppointments} />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <UpcommingAppointments
                  appointments={appointments}
                  fetchAppointments={fetchAppointments}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <LastAppointments rows={appointments} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientRendezVous;
