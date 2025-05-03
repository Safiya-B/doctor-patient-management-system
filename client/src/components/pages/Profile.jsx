import { Button, Grid, Paper, TextField, Typography } from "@mui/material";

import React, { useContext, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import validate from "../Authentication/validation/validateInfo";
import validatePassword from "../Authentication/validation/validatePassword";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import _ from "lodash";
import { UserDataContext } from "../../context/UserDataContext";
import useFetchUser from "../../hooks/useFetchUser";

const useStyles = (theme) => ({
  root: {
    paddingTop: "100px",
  },
  paper: {
    overflow: "auto",
    padding: "20px",
  },
  btn: {
    marginTop: "20px",
  },
  title: { marginBottom: "20px" },
});

const Profile = () => {
  const classes = useStyles();
  const { user, fetchUser } = useFetchUser(false);

  const initialState = {
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    phone: user.phone,
  };

  const { auth } = useAuth();
  const [disableInfo, setDisableInfo] = useState(true);
  const [disablePassword, setDisablePassword] = useState(true);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState(initialState);
  const [passwordError, setPasswordError] = useState({});
  const [passwordFields, setPasswordFields] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  //disable first form button if fields are not changing
  useEffect(() => {
    if (!_.isEqual(info, initialState)) setDisableInfo(false);
    else setDisableInfo(true);
  }, [info]);

  //disable second form button if fields are not changing
  useEffect(() => {
    if (!Object.values(passwordFields).every((x) => x === ""))
      setDisablePassword(false);
    else setDisablePassword(true);
  }, [passwordFields]);

  const handleChangeInfo = (event) => {
    const { value, name } = event.target;
    setInfo({ ...info, [name]: value });
    if (value !== "") setErrors({ ...errors, [name]: "" });
  };

  const handleChangePassword = (event) => {
    const { value, name } = event.target;
    setPasswordFields({ ...passwordFields, [name]: value });
    if (value !== "") setPasswordError({ ...passwordError, [name]: "" });
  };

  const handleSubmitInfo = async () => {
    setErrors(validate(info));

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      };

      await axios.put("/api/users/profile", info, config);
      fetchUser();
      setDisableInfo(true);
      toast.success("Vos informations ont bien été mis à jour");
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const handleSubmitPassword = async () => {
    setPasswordError(validatePassword(passwordFields));

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      };
      await axios.put("/api/users/profile/password", passwordFields, config);
      setDisablePassword(true);
      toast.success("Vos informations ont bien été mises à jour");
    } catch (error) {
      const errArray = error?.response?.data?.errors;

      //not a validation error
      error?.response?.data?.status !== 403 &&
        toast.error(
          error?.response?.data?.error ||
            errArray.map((err) => <p>{err.msg}</p>)
        );
    }
  };
  return (
    <Grid
      container
      className={classes.root}
      justifyContent="center"
      spacing={2}
    >
      <Grid item xs={12} lg={8}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Informations personnelles
          </Typography>
          <TextField
            error={errors.lastName ? true : false}
            helperText={errors.lastName}
            margin="dense"
            id="lastName"
            name="lastName"
            label="lastName"
            type="text"
            value={info.lastName}
            onChange={handleChangeInfo}
            fullWidth
          />
          <TextField
            error={errors.firstName ? true : false}
            helperText={errors.firstName}
            margin="dense"
            id="firstName"
            name="firstName"
            label="firstName"
            type="text"
            value={info.firstName}
            onChange={handleChangeInfo}
            fullWidth
          />
          <TextField
            error={errors.email ? true : false}
            helperText={errors.email}
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="text"
            value={info.email}
            onChange={handleChangeInfo}
            fullWidth
          />
          <TextField
            error={errors.phone ? true : false}
            helperText={errors.phone}
            margin="dense"
            id="phone"
            name="phone"
            label="Téléphone"
            value={info.phone}
            onChange={handleChangeInfo}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={handleSubmitInfo}
            disabled={disableInfo}
            size="small"
          >
            Mettre à jour
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={8}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Changer le mot de passe
          </Typography>
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="Mot de Passe actuel"
            type="password"
            autoComplete="new-password"
            value={passwordFields.password}
            onChange={handleChangePassword}
            fullWidth
          />
          <TextField
            error={passwordError.newPassword ? true : false}
            helperText={passwordError.newPassword}
            margin="dense"
            id="newPassword"
            name="newPassword"
            label="Nouveau mot de passe"
            value={passwordFields.newPassword}
            onChange={handleChangePassword}
            type="password"
            fullWidth
          />
          <TextField
            error={passwordError.confirmPassword ? true : false}
            helperText={passwordError.confirmPassword}
            margin="dense"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmez le mot de passe"
            type="password"
            value={passwordFields.confirmPassword}
            onChange={handleChangePassword}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.btn}
            onClick={handleSubmitPassword}
            disabled={disablePassword}
            size="small"
          >
            Mettre à jour
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
