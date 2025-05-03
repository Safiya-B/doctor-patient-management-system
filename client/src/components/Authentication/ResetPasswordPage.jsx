import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPublic } from "../../api/axios";
import { Grid, Button, Typography, Box, TextField, Paper } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validatePassword from "./validation/validatePassword";

const ResetPasswordPage = ({}) => {
  const [values, setValues] = useState({
    password: "",
    confirmPswd: "",
  });

  const navigate = useNavigate();
  const { resetToken } = useParams();

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (value !== "") setErrors({ ...errors, [name]: "" });
  };

  const handleResetPswd = async (event) => {
    event.preventDefault();

    setErrors(validatePassword(values));

    try {
      console.log(errors);
      const { data } = await axiosPublic.put(
        `/api/auth/reset-password/${resetToken}`,
        values
      );
      navigate("/login");
      toast.success(data.message);
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 500)
        toast.error(error?.response?.data?.error);

      setValues({ password: "", confirmPswd: "" });
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          sx={{
            overflow: "hidden",
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reset Your Password
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ opacity: 0.6, fontWeight: "200" }}
            >
              Please enter your new password below to reset your account
              password.
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 2,
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleResetPswd}
            >
              <TextField
                size="small"
                type="password"
                error={errors.password ? true : false}
                label="New Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                helperText={errors.password}
                variant="outlined"
              />
              <TextField
                size="small"
                type="password"
                error={errors.confirmPswd ? true : false}
                label="Confirm New Password"
                name="confirmPswd"
                value={values.confirmPswd}
                onChange={handleChange}
                helperText={errors.confirmPswd}
                variant="outlined"
              />
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPasswordPage;
