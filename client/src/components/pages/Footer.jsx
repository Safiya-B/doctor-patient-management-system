import React from "react";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Grid
      container
      sx={{
        borderTop: "1px solid lightgrey",
        textAlign: "center",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <Grid item xs={12}>
        Dr. JOHNSON © 2025 | All rights reserved.
        <span sx={{ margin: " 0 10px 0 10px" }}>|</span>
        <Link to="/confidentialité">Privacy Policy</Link>
      </Grid>
    </Grid>
  );
};

export default Footer;
