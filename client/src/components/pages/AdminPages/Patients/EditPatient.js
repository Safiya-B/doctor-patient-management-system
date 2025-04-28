import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "../../../../api/axios";
import { toast } from "react-toastify";
import validateUpdateInfo from "../../../Authentication/validation/validateUser";

// Styled component for a close button in the dialog
const DialogTitleWithClose = ({ children, onClose }) => (
  <DialogTitle sx={{ m: 0, p: 2 }}>
    {children}
    {onClose && (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
    )}
  </DialogTitle>
);

const EditPatient = ({ user, fetchUsers }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    phone: user.phone,
  });
  const [initialValues] = useState(values);
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    // Enable Update button if at least one field is modified and there are no errors
    const isFormValid = Object.keys(errors).every((key) => !errors[key]);
    setIsModified(
      isFormValid &&
        Object.keys(values).some((key) => values[key] !== initialValues[key])
    );
  }, [values, errors, initialValues]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateUpdateInfo(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { data } = await axios.put(`/api/users/${user._id}`, values);
        fetchUsers();
        handleClose();
        toast.success("Patient information updated successfully.");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.error || "Error updating user.");
      }
    }
  };

  return (
    <>
      <Button color="primary" onClick={handleOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitleWithClose onClose={handleClose}>
          Edit Patient Information
        </DialogTitleWithClose>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="dense"
          />
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={!isModified}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPatient;
