import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import moment from "moment";
import Disponibilites from "./Disponibilites";

import IconButton from "@mui/material/IconButton";
import useSettings from "../../../hooks/useSettings";
import Loading from "../Loading";
import { Grid } from "@mui/material";
import UpcommingAppointment from "./UpcommingAppointments";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import "./calendar.css";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Paper } from "@mui/material";
import swal from "sweetalert2";
import useRequestAppointments from "../../../hooks/useRequestAppointments";
import useRequestSlots from "../../../hooks/useRequestSlots";
import { CheckedDaysProvider } from "../../../context/CheckedDaysContext";
import axios from "../../../api/axios";

const useStyles = (theme) => ({
  root: {
    paddingTop: "100px",
  },
  paper: {
    padding: "20px",
  },
});

const DayContent = ({ date, eventsArray, setEventsArray, view }) => {
  const dayDate = moment(date).format("DD-MM-YYYY");

  const handleAppointment = async () => {
    const inputValue = await swal({
      title: "Ajouter un horaire",
      text: `Le ${dayDate} à :`,
      content: {
        element: "input",
        attributes: {
          type: "time",
          required: true,
        },
      },
    });
    if (inputValue && inputValue !== "") {
      try {
        const dateTimeObj = {
          date: dayDate,
          time: inputValue,
        };
        //add timeslot
        const { data } = await axios.post(
          "/api/appointments/slot",
          dateTimeObj
        );
        //add event timeslot in frontend
        const dateTimeString = moment(
          `${dayDate} ${inputValue}`,
          "DD-MM-YYYY HH:mm"
        ).toDate();

        setEventsArray((prev) => [...prev, { time: "", date: dateTimeString }]);
        console.log(eventsArray);
        toast.success("Horaire ajouté");
      } catch (error) {
        toast.error("Impossible d'ajouter l'horaire");
      }
    }
  };

  if (view.type === "dayGridMonth")
    return (
      <>
        <IconButton size="small" onClick={handleAppointment}>
          <AddIcon fontSize="small" />
        </IconButton>
        <span>{date.getDate()}</span>
      </>
    );
};

const EventDetail = (eventInfo) => {
  const removeAppointment = async () => {
    const time = moment(eventInfo.event.start).format("HH:mm");
    const date = moment(eventInfo.event.start).format("DD-MM-YYYY");
    const dateTimeObj = {
      time: time,
      date: date,
    };

    const confirm = await swal({
      title: "Êtes-vous sûrs de vouloir supprimer cet horaire ?",
      buttons: ["Annuler", true],
      dangerMode: true,
    });

    if (confirm)
      try {
        //remove timeslot from backend
        const { data } = await axios.put(
          "/api/appointments/remove",
          dateTimeObj
        );
        //remove event timeslot in frontend
        eventInfo.event.remove();
        toast.success("Horaire supprimé");
      } catch (error) {
        toast.error("Impossible de supprimer l'horaire");
      }
  };

  if (eventInfo.view.type === "dayGridMonth")
    return (
      <>
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <div
            className={`fc-daygrid-event-dot ${
              eventInfo.event.title !== "" && "fc-green-dot"
            }`}
          ></div>
          <div className="fc-event-time">{eventInfo.timeText}</div>
          <div className="fc-event-title">{eventInfo.event.title}</div>
        </div>
        {eventInfo.event.title === "" && (
          <ClearIcon className="clear-icon" onClick={removeAppointment} />
        )}
      </>
    );
};

const RendezVous = () => {
  const classes = useStyles();
  const [calendarAppointments, setCalendarAppointments] = useState([]);
  const [eventsArray, setEventsArray] = useState([]);
  const { initialSettings, loading } = useSettings();

  const { appointments, loadAppointments, fetchAppointments } =
    useRequestAppointments();

  const { timeSlots, fetchSlots } = useRequestSlots();
  console.log("from rendez vous", appointments);
  useEffect(() => {
    if (appointments.length > 0)
      // assign user to each appointment and return the appointment array with the latest appointments
      setCalendarAppointments(
        appointments
          .map((a) =>
            a.appointments.map((i) => {
              if (!i.cancelled && !i.ended)
                return {
                  title: a?.user?.lastName,
                  date: moment(
                    `${i.date} ${i.time}`,
                    "DD-MM-YYYY HH:mm"
                  ).toDate(),
                  color: "#4caf50",
                };
              else return {};
            })
          )
          .flat()
      );
    if (timeSlots.length > 0) {
      setEventsArray(
        timeSlots
          .map((t) =>
            t.timeSlots.map((i) => ({
              title: "",
              date: moment(`${t.date} ${i}`, "DD-MM-YYYY HH:mm").toDate(),
            }))
          )
          .flat()
      );
    }
  }, [appointments, timeSlots]);

  const handleSetEventsArray = (newEventsArray) => {
    setEventsArray(newEventsArray);
  };
  const DayContentWrapper = ({ date, view }) => (
    <DayContent
      view={view}
      date={date}
      eventsArray={eventsArray}
      setEventsArray={handleSetEventsArray}
    />
  );

  return loading || loadAppointments ? (
    <Loading />
  ) : (
    <div className={classes.root}>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item xs={12}>
          <CheckedDaysProvider>
            <Disponibilites initialSettings={initialSettings} />
          </CheckedDaysProvider>
        </Grid>{" "}
        <Grid item xs={12}>
          <UpcommingAppointment
            appointments={appointments}
            timeSlots={timeSlots}
            fetchSlots={fetchSlots}
            fetchAppointments={fetchAppointments}
          />
        </Grid>
        <Grid item xs={12}>
          {console.log(calendarAppointments)}
          <Paper className={classes.paper}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              views={{
                dayGridMonth: { dayMaxEventRows: 10 },
              }}
              locale={frLocale}
              events={eventsArray.concat(calendarAppointments)}
              eventContent={EventDetail}
              slotDuration={`00:${initialSettings.minutes}`}
              slotMinTime={initialSettings.startTime}
              slotMaxTime={initialSettings.endTime}
              defaultTimedEventDuration="00:15:00"
              showNonCurrentDates={false}
              dayCellContent={DayContentWrapper}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {/* <LastAppointments rows={appointments} /> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default RendezVous;
