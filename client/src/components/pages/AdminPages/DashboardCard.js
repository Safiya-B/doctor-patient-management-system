import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";

const DashboardCard = ({ title, count, Icon, iconColor, onClick }) => {
  return (
    <Card
      sx={{
        minWidth: 250,
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Icon sx={{ fontSize: 30, color: iconColor }} />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {count}
          </Typography>
        </CardContent>{" "}
      </CardActionArea>
    </Card>
  );
};

export default DashboardCard;
