import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import axios from "../../../../api/axios";
import validateUser from "../../../Authentication/validation/validateUser";
import ReusableDialog from "../../ReusableDialog";

const AddPatient = ({ fetchUsers }) => {
  const [open, setOpen] = useState(false);

  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setValues({ lastName: "", firstName: "", email: "", phone: "" });
    setErrors({});
  };

  const handleChange = (event) => {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
    if (value !== "") setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors(validateUser(values));
    try {
      await axios.post("/api/users", values);
      toast.success("Patient added successfully");
      fetchUsers();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to add patient");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        New Patient
      </Button>
      <ReusableDialog
        open={open}
        onClose={handleClose}
        title="Add Patient"
        onSubmit={handleSubmit}
        submitText="Add"
        cancelText="Cancel"
      >
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          *An invitation email will be sent to the patient with instructions to
          set up their password.
        </Typography>
      </ReusableDialog>
    </>
  );
};

export default AddPatient;
