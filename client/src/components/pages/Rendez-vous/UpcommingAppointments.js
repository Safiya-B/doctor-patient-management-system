import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import moment from "moment";

import Dialog from "@mui/material/Dialog";
import { DialogTitle, DialogActions } from "../Dialog";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Paper, Typography } from "@mui/material";

import useAuth from "../../../hooks/useAuth";

var _ = require("lodash");

const useStyles = {
  title: {
    padding: "8px 0px 0px 16px",
  },
  time: {
    border: "1px solid lightgray",
    borderRadius: "3px",
    padding: "3px",
    margin: "0 5px 0 5px",
  },
  dialogButtons: {
    justifyContent: "flex-start",
  },
  listText: {
    width: "75%",
  },
};

const UpcommingAppointments = ({
  appointments,
  timeSlots,
  fetchSlots,
  fetchAppointments,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const [lastAppointments, setLastAppointments] = useState([]);

  const handleOpen = (id) => {
    setOpen(id);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const sortByDate = (a, b) => {
    return (
      new moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") -
      new moment(b.date, "DD-MM-YYYY").format("YYYYMMDD")
    );
  };
  const sortByTime = (a, b) => {
    return a.time.localeCompare(b.time);
  };

  useEffect(() => {
    if (appointments.length > 0)
      // assign user to each appointment and return the appointment array with the latest appointments
      setLastAppointments(
        appointments
          .map((a) => a.appointments.map((i) => ({ ...i, user: a.user })))
          .flat()
          .filter((i) => i.cancelled === false && i.ended === false)
          .sort(sortByTime)
          .sort(sortByDate)
          .slice(0, 3)
      );
  }, [appointments, timeSlots]);

  const handleCancelAppointment = async (appointmentId, userId) => {
    try {
      const info = {
        appointmentId,
        userId,
      };

      const { data } = await axios.put("/api/appointments/cancel", info);
      handleClose();
      fetchAppointments();
      fetchSlots();
      toast.success("Le Rendez-vous est annulé");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Paper>
      <Typography className={classes.title} variant="h6">
        À venir
      </Typography>
      <List>
        {lastAppointments.length === 0 ? (
          <ListItem>
            <ListItemText>Aucun rendez-vous à venir</ListItemText>
          </ListItem>
        ) : (
          lastAppointments.map((a) => (
            <ListItem key={a._id}>
              <ListItemText>
                <Typography className={classes.listText}>
                  {`Rendez-vous pour ${a?.user?.lastName} ${a?.user?.firstName} le ${a?.date} à ${a?.time}`}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(a._id)}
                >
                  Annuler
                </Button>
                <Dialog
                  open={open === a._id}
                  onClose={handleClose}
                  ledby="form-dialog-title"
                  fullWidth
                >
                  <DialogTitle id="form-dialog-title" onClose={handleClose}>
                    Êtes-vous sûrs de vouloir annuler ce rendez-vous ?
                  </DialogTitle>
                  <DialogActions classes={{ root: classes.dialogButtons }}>
                    <Button
                      color="primary"
                      onClick={() => handleCancelAppointment(a._id, a.user._id)}
                    >
                      Confirmer
                    </Button>
                  </DialogActions>
                </Dialog>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default UpcommingAppointments;
