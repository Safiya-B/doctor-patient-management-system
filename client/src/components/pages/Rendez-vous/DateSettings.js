import React, { useState, useEffect } from "react";

import "date-fns";
import Typography from "@mui/material/Typography";
import { Grid, MenuItem, Select } from "@mui/material";
import TimeSlots from "./TimeSlots";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import frLocale from "date-fns/locale/fr";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import generateTimesArray from "../utils/Times";

const useStyles = (theme) => ({
  container: { paddingTop: "20px" },
  timepickers: { display: "flex", flexDirection: "column" },
  dateRange: {
    display: "flex",
    alignItems: "center",
  },
  dateText: {
    marginRight: "20px",
  },
  startDate: {
    marginRight: "30px",
  },
});

const DateSettings = ({
  timeLength,
  selectedDateStart,
  selectedDateEnd,
  handleDateStartChange,
  handleDateEndChange,
  resetCheckboxes,
  startTime,
  endTime,
  handleStartTimeChange,
  handleEndTimeChange,
}) => {
  const classes = useStyles();

  // generating array with times from 00:00 to 23:45
  const timesArray = generateTimesArray(timeLength);
  const selectTimes = generateTimesArray(60);
  const [timeSlots, setTimeSlots] = useState([]);

  const handleChangeMtime = (event) => {
    handleStartTimeChange(event.target.value);
    resetCheckboxes();
  };
  const handleChangeEtime = (event) => {
    handleEndTimeChange(event.target.value);
    resetCheckboxes();
  };

  class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
      return format(date, "d MMM yyyy", { locale: this.locale });
    }
  }

  useEffect(() => {
    const times = [];
    // looping through timesArray from startTime to endTime values chosed by user
    timesArray
      .slice(timesArray.indexOf(startTime), timesArray.indexOf(endTime))
      .forEach((time, index) => {
        // add all times as objects in times array
        times.push(time);
      });
    setTimeSlots(times);
  }, [timeLength, startTime, endTime]);

  return (
    <div>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={12}>
          <Typography variant="h6">Période de disponibilité</Typography>
        </Grid>
        <Grid item xs={12} className={classes.dateRange}>
          <Typography className={classes.dateText}>Du</Typography>
          <LocalizationProvider utils={LocalizedUtils} locale={frLocale}>
            <DatePicker
              //maxDate={selectedDateEnd}
              // maxDateMessage="Date de début inferieure"
              format="d MMM yyyy"
              disableToolbar
              //disablePast
              variant="inline"
              value={selectedDateStart}
              onChange={handleDateStartChange}
              className={classes.startDate}
            />
            <Typography className={classes.dateText}>Au</Typography>
            <DatePicker
              /*  maxDate={
                new Date(new Date().setMonth(new Date().getMonth() + 12))
              } */
              format="d MMM yyyy"
              disableToolbar
              variant="inline"
              value={selectedDateEnd}
              onChange={handleDateEndChange}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Début et fin d'une journée</Typography>
        </Grid>
        <Grid item xs={4} className={classes.timepickers}>
          <Typography variant="body1">De </Typography>
          <Select onChange={handleChangeMtime} value={startTime} displayEmpty>
            {selectTimes
              .slice(selectTimes.indexOf("04:00"), selectTimes.indexOf("13:00"))
              .map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
          </Select>
        </Grid>
        <Grid item xs={4} className={classes.timepickers}>
          <Typography variant="body1">À</Typography>
          <Select onChange={handleChangeEtime} value={endTime} displayEmpty>
            {selectTimes
              .slice(selectTimes.indexOf("13:00"), selectTimes.length)
              .map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Horaires</Typography>
        </Grid>
        <Grid item xs={12}>
          <TimeSlots
            timeSlots={timeSlots}
            timeLength={timeLength}
            startTime={startTime}
            endTime={endTime}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DateSettings;
