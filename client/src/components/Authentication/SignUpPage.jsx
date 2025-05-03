import { React, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import validateSignUp from "./validation/validateSignUp";
import { axiosPublic } from "../../api/axios";
import image from "../../assets/images/auth-image.jpg";
import {
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  Paper,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
    if (value !== "") setErrors({ ...errors, [name]: "" });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    //frontend errors
    setErrors(validateSignUp(values));
    try {
      const { data } = await axiosPublic.post("/api/auth/register", values);
      navigate("/login");
      toast.success(
        "Your account has been created successfully! You can now sign in"
      );
    } catch (error) {
      //backend errors
      if (error.response.status === 401) toast.error(error.response.data.error);
      else if (error.response.status === 500)
        toast.error("There was a server error. Please try again later.");
      else
        toast.error(
          "An error occurred. Please check your details and try again."
        );
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
          <Box
            component="img"
            src={image}
            alt="Sign up"
            sx={{
              width: "100%",
              height: "auto",
            }}
          />

          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create an account
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
              onSubmit={handleSignUp}
            >
              <TextField
                size="small"
                error={errors.firstName ? true : false}
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                helperText={errors.firstName}
                variant="outlined"
              />
              <TextField
                size="small"
                error={errors.lastName ? true : false}
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                helperText={errors.lastName}
                variant="outlined"
              />
              <TextField
                size="small"
                error={errors.email ? true : false}
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                helperText={errors.email}
                variant="outlined"
                autoComplete="off"
              />
              <TextField
                size="small"
                error={errors.phone ? true : false}
                label="Phone Number"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                helperText={errors.phone}
                variant="outlined"
              />
              <TextField
                size="small"
                error={errors.password ? true : false}
                onChange={handleChange}
                label="Password"
                name="password"
                type="password"
                value={values.password}
                helperText={errors.password}
                variant="outlined"
                autoComplete="new-password"
              />

              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Sign up
              </Button>
            </Box>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account ?{" "}
                <Link component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
