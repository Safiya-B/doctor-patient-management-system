import { React, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { axiosPublic } from "../../api/axios";
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ state: false, message: "" });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setEmail(value);

    if (value !== "") setError({ state: false, message: "" });
  };

  const handleForgotPswd = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axiosPublic.post("/api/auth/forgot-password", {
        email,
      });
      navigate("/login");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
      setError({ state: true, message: "invalid email" });
      setEmail("");
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
              Forgot Your Password ?
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ opacity: 0.6, fontWeight: "200" }}
            >
              Please enter your email address below. We will send you a link to
              reset your password.
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
              onSubmit={handleForgotPswd}
            >
              <TextField
                error={error.state}
                size="small"
                label="Email"
                name="email"
                value={email}
                onChange={handleChange}
                helperText={error.message}
                variant="outlined"
              />
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Send Reset Link
              </Button>
              <Link
                component={RouterLink}
                variant="body2"
                to="/login"
                sx={{ alignSelf: "flex-end" }}
              >
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordPage;
