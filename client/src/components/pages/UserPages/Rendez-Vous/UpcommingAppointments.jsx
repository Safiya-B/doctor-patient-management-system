import React, { useState } from "react";

import axios from "../../../../api/axios";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Paper, Typography } from "@mui/material";
import { DialogActions, DialogTitle } from "../../Dialog";

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
};

const UpcommingAppointments = ({ appointments, fetchAppointments }) => {
  const classes = useStyles();
  const [openId, setOpenId] = useState(null);

  const handleOpenId = (id) => {
    setOpenId(id);
  };
  const handleClose = () => {
    setOpenId(null);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const info = {
        appointmentId,
      };

      const { data } = await axios.put(
        "/api/appointments/booking/cancel",
        info
      );
      handleClose();
      fetchAppointments();
      toast.success("Votre rendez-vous est annulé", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };
  console.log(appointments);
  if (
    appointments.length === 0 ||
    !appointments.some((p) => !p.cancelled && !p.ended)
  )
    return (
      <Paper>
        <List>
          <Typography className={classes.title} variant="h6">
            À venir
          </Typography>
          <ListItem>
            <ListItemText>Aucun rendez-vous à venir</ListItemText>
          </ListItem>
        </List>
      </Paper>
    );

  return (
    <Paper>
      <Typography className={classes.title} variant="h6">
        À venir
      </Typography>
      <List>
        {appointments
          .filter((a) => a.cancelled === false && a.ended === false)
          .map((a) => (
            <ListItem key={a._id}>
              <ListItemText>
                Rendez-vous le {a.date} à {a.time}
              </ListItemText>
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenId(a._id)}
                >
                  Annuler
                </Button>
                <Dialog
                  open={openId === a._id}
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
                      onClick={() => handleCancelAppointment(a._id)}
                    >
                      Confirmer
                    </Button>
                  </DialogActions>
                </Dialog>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Paper>
  );
};

export default UpcommingAppointments;
