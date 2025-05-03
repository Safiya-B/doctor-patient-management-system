import React, { useState, useEffect, useContext } from "react";
import axios from "../../../api/axios";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { toast } from "react-toastify";
import { Grid, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import DateSettings from "./DateSettings";
import { CheckedDaysContext } from "../../../context/CheckedDaysContext";
import useAuth from "../../../hooks/useAuth";

const useStyles = (theme) => ({
  root: {
    padding: "50px 0 50px 0",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Disponibilites = ({ initialSettings }) => {
  const classes = useStyles();
  const { auth } = useAuth();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(15);
  const [checkedDays, setCheckDays] = useContext(CheckedDaysContext);
  const [selectedDateStart, handleDateStartChange] = useState(new Date());
  const [selectedDateEnd, handleDateEndChange] = useState(
    // 2 months from now
    new Date(new Date().setMonth(new Date().getMonth() + 2))
  );
  const [startTime, handleStartTimeChange] = useState("09:00");
  const [endTime, handleEndTimeChange] = useState("18:00");
  const minutesArray = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  useEffect(() => {
    if (initialSettings) {
      setCheckDays(initialSettings.times);
      setMinutes(initialSettings.minutes);
      handleDateStartChange(initialSettings.startDate);
      handleDateEndChange(initialSettings.endDate);
      handleStartTimeChange(initialSettings.startTime);
      handleEndTimeChange(initialSettings.endTime);
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetCheckboxes = () => {
    setCheckDays({
      lundi: [],
      mardi: [],
      mercredi: [],
      jeudi: [],
      vendredi: [],
      samedi: [],
      dimanche: [],
    });
  };

  const handleChangeMinutes = (e) => {
    setMinutes(e.target.value);
    resetCheckboxes();
  };

  const handleConfirmDialog = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleSubmitTimes = async () => {
    try {
      const values = {
        times: checkedDays,
        startDate: selectedDateStart,
        endDate: selectedDateEnd,
        minutes,
        startTime,
        endTime,
      };
      console.log(values);

      const { data } = await axios.post("/api/appointments", values);
      handleCloseConfirm();
      handleClose();
      toast.success(data.success);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<ScheduleIcon />}
        size="large"
      >
        Disponibilités
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Réglage des disponibilités
            </Typography>
            <Button autoFocus color="inherit" onClick={handleConfirmDialog}>
              Enregistrer
            </Button>
            <Dialog
              open={openConfirm}
              onClose={handleClose}
              ledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Voulez-vous enregistrer ces nouveaux paramètres ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirm} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleSubmitTimes} color="primary" autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
        </AppBar>
        <Grid container justifyContent="center" className={classes.root}>
          <Grid item xs={8} md={8}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12}>
                <Typography variant="h6">Durée d'une consultation</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel>minutes</InputLabel>
                  <Select onChange={handleChangeMinutes} value={minutes}>
                    {minutesArray.map((minute) => (
                      <MenuItem value={minute} key={minute}>
                        {minute}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateSettings
                  timeLength={minutes}
                  selectedDateStart={selectedDateStart}
                  selectedDateEnd={selectedDateEnd}
                  handleDateStartChange={handleDateStartChange}
                  handleDateEndChange={handleDateEndChange}
                  resetCheckboxes={resetCheckboxes}
                  startTime={startTime}
                  endTime={endTime}
                  handleStartTimeChange={handleStartTimeChange}
                  handleEndTimeChange={handleEndTimeChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default Disponibilites;
