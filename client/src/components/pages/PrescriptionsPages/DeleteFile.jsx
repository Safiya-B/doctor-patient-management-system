import { React, useState, useContext } from "react";
import axios from "../../../api/axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useFetchUsers from "../../../hooks/useFetchUsers";

const useStyles = (theme) => ({
  root: {
    padding: "20px",
  },

  attachButton: {
    marginTop: "30px",
  },
  dialogButtons: {
    justifyContent: "flex-start",
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

const DeleteFile = ({ folderName, fileName }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const { fetchUsers } = useFetchUsers(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (folderName, fileName) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      };
      await axios.delete(`/api/files/${folderName}/${fileName}`, config);
      handleClose();
      toast.success("ficher supprimé");
      fetchUsers();
    } catch (error) {
      toast.error(error.response.data.error, {
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

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        ledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Êtes-vous sûrs de supprimer ce fichier ?
        </DialogTitle>

        <DialogActions classes={{ root: classes.dialogButtons }}>
          <Button
            color="primary"
            onClick={() => handleDelete(folderName, fileName)}
          >
            Supprimer
          </Button>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteFile;
