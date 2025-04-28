import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import frLocale from "date-fns/locale/fr";
import Slide from "@mui/material/Slide";
import ScheduleIcon from "@mui/icons-material/Schedule";
import useMediaQuery from "@mui/material/useMediaQuery";
import useRequestSlots from "../../../../hooks/useRequestSlots";
import axios from "../../../../api/axios";
import { toast } from "react-toastify";

const useStyles = (theme) => ({
  root: {
    padding: "50px 0 50px 0",
  },
  gridContainer: {
    maxWidth: "475px",
  },
  btnRoot: {
    padding: "5px 10px 5px 10px",
    color: "#3f51b5",
    border: "1px solid rgba(63, 81, 181, 0.5)",
    backgroundColor: "#fff",
    borderRadius: "4px",
    lineHeight: "1.75",
    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      backgroundColor: "rgba(63, 81, 181, 0.04)",
    },
    cursor: "pointer",
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
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timesBtn: {
    color: "white",
    backgroundColor: "#3f51b5",
    padding: "5px 10px 5px 10px",
    border: "1px solid rgba(63, 81, 181, 0.5)",
    cursor: "pointer",
    borderRadius: "4px",
    lineHeight: "1.75",
  },
  dialogContentText: {
    margin: "20px",
  },
  confirmationTxt: {
    color: "rgb(0,0,0,.54)",
    marginLeft: "10px",
  },
  dialogActions: {
    justifyContent: "space-between",
  },
});

//override datepicker theme

const materialTheme = createTheme({
  overrides: {
    MuiPickersStaticWrapper: {
      staticWrapperRoot: {
        overflow: "unset",
      },
    },
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

const AppointmentDialog = ({ fetchAppointments }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [date, changeDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const { timeSlots, fetchSettingsData } = useRequestSlots();

  useEffect(() => {
    const availableDates = timeSlots.filter(
      (d) => d.date === format(date, "dd-MM-yyyy")
    );

    if (availableDates.length > 0)
      setAvailableTimes(availableDates[0].timeSlots.map((t) => t));
  }, [date, timeSlots]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTime("");
  };

  const handleSelectBtn = (e) => {
    setSelectedTime(e.target.value);
  };

  const bookAppointment = async (e) => {
    try {
      const values = {
        date: format(date, "dd-MM-yyyy"),
        time: selectedTime,
      };

      const { data } = await axios.post("/api/appointments/booking", values);
      handleClose();
      fetchAppointments();
      toast.success(data.success);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const disableDates = (date) => {
    const availableDates = timeSlots.map((t) => t.date);
    const times = timeSlots.filter(
      (t) => t.date === format(date, "dd-MM-yyyy")
    );
    let timesLength = true;
    if (times.length > 0) timesLength = times[0].timeSlots.length <= 0;
    //disable date if it is not in slots array or if all timeSlots are booked(empty timesSlots array)
    return !availableDates.includes(format(date, "dd-MM-yyyy")) || timesLength;
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<ScheduleIcon />}
        size="large"
      >
        Prendre Rendez-vous
      </Button>
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle id="responsive-dialog-title">Rendez-vous</DialogTitle>
        <DialogContent className={classes.dialogContent} dividers>
          <DialogContentText className={classes.dialogContentText}>
            Selectionnez la date
          </DialogContentText>
          <LocalizationProvider utils={LocalizedUtils} locale={frLocale}>
            <ThemeProvider theme={materialTheme}>
              <DatePicker
                orientation="landscape"
                autoOk
                disablePast
                variant="static"
                openTo="date"
                value={date}
                onChange={changeDate}
                shouldDisableDate={disableDates}
              />
            </ThemeProvider>
          </LocalizationProvider>
          <DialogContentText className={classes.dialogContentText}>
            {availableTimes.length === 0
              ? "Aucune disponibilité"
              : "Selectionnez l'heure"}
          </DialogContentText>
          <Grid container spacing={3} className={classes.gridContainer}>
            {availableTimes.sort().map((time) => (
              <Grid item xs={3} key={time}>
                <input
                  type="button"
                  className={
                    time === selectedTime ? classes.timesBtn : classes.btnRoot
                  }
                  value={time}
                  onClick={handleSelectBtn}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActions }}>
          <Typography className={classes.confirmationTxt}>
            {selectedTime &&
              `Rendez-vous le ${format(date, "dd/MM/yyyy")} à ${selectedTime}`}
          </Typography>
          <div>
            <Button autoFocus onClick={handleClose} color="primary">
              Annuler
            </Button>
            <Button onClick={bookAppointment} color="primary" autoFocus>
              Confirmer
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentDialog;
