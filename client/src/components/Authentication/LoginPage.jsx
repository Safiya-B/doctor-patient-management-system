import { React, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import validateLogin from "./validation/validateLogin";
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
import useAuth from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";

const LoginPage = () => {
  const { setAuth } = useAuth();
  const { setUser } = useUserData();

  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });

    if (value !== "") setErrors({ ...errors, [name]: "" });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors(validateLogin(values));
    try {
      const { data } = await axiosPublic.post("/api/auth/login", values);
      console.log(data);
      setAuth(data);
      setUser(data.user);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        toast.error(error.response.data.error);
      }
      if (error.response.status === 500 || error.response.status === 0) {
        toast.error("Server error, please try again");
        setValues({ email: "", password: "" });
      }
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
            alt="Login"
            sx={{
              width: "100%",
              height: "auto",
            }}
          />

          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to Dr. Johnson's Website
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ opacity: 0.6, fontWeight: "200" }}
            >
              Log in to Your Patient Portal
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
              onSubmit={handleLogin}
            >
              <TextField
                size="small"
                error={errors.email ? true : false}
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                helperText={errors.email}
                variant="outlined"
                autoComplete="email"
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
              <Link
                component={RouterLink}
                to="/forgotPassword"
                variant="body2"
                sx={{ alignSelf: "flex-end" }}
              >
                Forgot Password?
              </Link>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                type="button"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
