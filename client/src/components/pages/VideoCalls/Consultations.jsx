import React, { useState, useEffect } from "react";
import { Button, Typography, Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import axios from "../../../api/axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/lab/Autocomplete";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import ConsultationsTable from "./ConsultationsTable";
import useRequestParticipants from "../../../hooks/useRequestParticipants";
import Loading from "../Loading";
import useFetchUsers from "../../../hooks/useFetchUsers";

const useStyles = (theme) => ({
  gridContainer: {
    //paddingLeft: "10px",
    paddingTop: "100px",
  },

  cardPadding: {
    padding: "10px 0px 15px 15px",
  },
  cardMargin: {
    marginTop: "20px",
  },
  joinLink: {
    textDecoration: "none",
  },
  redButton: {
    color: "#f34f4f",
    border: "1px solid #f34f4fab",
    "&:hover": {
      color: "#f34f4f",
      border: " 1px solid #f34f4f",
    },
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const Consultations = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { users, fetchUsers, loading } = useFetchUsers(true);
  const { participants, loadParticipants } = useRequestParticipants();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //change the email input based on the name input
  useEffect(() => {
    if (name && users.find((user) => user.lastName === name))
      setEmail(users.find((user) => user.lastName === name).email);
    else setEmail("Aucun email");
  }, [name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put("/api/video/add-waitingroom", {
        lastName: name,
        email: email,
      });
      handleClose();
      toast.success("Nouvelle Teléconsultation ajoutée avec succès");

      fetchUsers();
    } catch (error) {
      toast.error(<div>{error.response.data.error}</div>, {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancelMeeting = async (event, name, email) => {
    event.preventDefault();

    try {
      await axios.put("/api/video/remove-waitingroom", {
        lastName: name,
        email: email,
      });
      toast.success("Teléconsultation annulée");
      fetchUsers();
    } catch (error) {
      toast.error(<div>{"erreur"}</div>, {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return loadParticipants || loading ? (
    <Loading />
  ) : (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} xl={6}>
          <Grid container className={classes.gridContainer} spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleClickOpen}
              >
                Ajouter une téléconsultation
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                ledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  {" "}
                  Ajouter une téléconsultation
                </DialogTitle>
                <DialogContent>
                  <Autocomplete
                    freeSolo
                    value={name}
                    onInputChange={(event, newValue) => {
                      setName(newValue);
                    }}
                    id="free-solo-demo"
                    options={users.map((user) => user.lastName)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        id="lastName"
                        name="lastName"
                        label="lastName"
                        type="text"
                        fullWidth
                      />
                    )}
                  />
                  <TextField
                    disabled
                    value={email}
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Annuler
                  </Button>
                  <Button color="primary" onClick={handleSubmit}>
                    Ajouter
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={12}>
              {users.map((user) => {
                if (user.waitingRoom)
                  return (
                    <Card className={classes.cardMargin} key={user._id}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            Téléconsultation en attente
                          </Typography>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            component="p"
                          >
                            {user.lastName} a été ajouté pour la
                            téléconsultation
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions classes={{ root: classes.cardPadding }}>
                        <Link
                          to="/teleconsultation/video"
                          //target="_blank"
                          className={classes.joinLink}
                        >
                          <Button color="primary" variant="outlined">
                            Rejoindre
                          </Button>
                        </Link>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={(e) =>
                            handleCancelMeeting(e, user.lastName, user.email)
                          }
                          classes={{ root: classes.redButton }}
                        >
                          Annuler
                        </Button>
                      </CardActions>
                    </Card>
                  );
              })}
            </Grid>
            <Grid item xs={12}>
              <ConsultationsTable rows={participants} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Consultations;
