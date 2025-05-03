import React from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import VideocamIcon from "@mui/icons-material/Videocam";
import Typography from "@mui/material/Typography";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const useStyles = (theme) => ({
  root: {
    boxShadow: "0 18px 24px rgb(0 0 0 / 12%)",
    background: "rgb(251, 251, 251)",
  },
  /*   icon: {
    position: "absolute",
    top: "20%",
    left: "10%",
  }, */
  iconArea: {
    display: "grid",
    gridTemplateColumns: "30% 70%",
  },
  icon: {
    placeSelf: "center",
    fontSize: "50px",
  },
  personIcon: {
    //color: "#A2D729",

    //fontSize: "50px",
    color: "#76b852",
  },
  fileIcon: {
    //fontSize: "50px",
    color: "#ffc947",
  },
  cameraIcon: {
    //fontSize: "50px",
    color: "#06AED5",
  },
  calendarIcon: {
    color: "#e53935",
  },
  link: {
    textDecoration: "none",
  },
  content: {
    wordWrap: "break-word",
    paddingRight: "0px",
  },
});

const Box = ({ title, number, page }) => {
  const classes = useStyles();
  return (
    <Link to={page} className={classes.link}>
      <Card className={classes.root}>
        <CardActionArea>
          <div className={classes.iconArea}>
            {title === "Téléconsultations" ? (
              <VideocamIcon
                className={classes.icon + " " + classes.cameraIcon}
              />
            ) : (
              <CalendarTodayIcon
                className={classes.icon + " " + classes.calendarIcon}
              />
            )}
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography gutterBottom component="h2">
                {number}
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default Box;
