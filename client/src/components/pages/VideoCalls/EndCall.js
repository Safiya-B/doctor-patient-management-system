import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import useFetchUser from "../../../hooks/useFetchUser";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const useStyles = (theme) => ({
  btn: {
    marginTop: "30px",
  },
  main: {
    textAlign: "center",
    padding: "10%",
  },
});

const EndCall = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { fetchUser } = useFetchUser();

  const removeWaitingRoom = async () => {
    try {
      const { data } = await axios.put("/api/video/user-waitingroom", {});

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const backHome = () => {
    removeWaitingRoom();
    navigate("/");

    //fetchUser();
  };

  return (
    <div className={classes.main}>
      <Typography variant="h5">Téléconsultation terminée</Typography>
      <Button
        color="primary"
        variant="outlined"
        className={classes.btn}
        onClick={backHome}
      >
        retourner à la page d'acceuil
      </Button>
    </div>
  );
};

export default EndCall;
