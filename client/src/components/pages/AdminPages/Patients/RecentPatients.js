import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Paper,
  ListItemAvatar,
  CardHeader,
} from "@mui/material";
import { stringToColor } from "../../utils/avatar-colors";

const RecentPatients = ({ patients }) => {
  const recentPatients = patients
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: "10px" }}>
        Recent Patients
      </Typography>
      <List>
        {recentPatients.map((patient) => (
          <ListItem key={patient._id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: stringToColor(patient.email) }}>
                {patient.lastName.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${patient.firstName} ${patient.lastName}`}
              secondary={`Joined on: ${new Date(
                patient.createdAt
              ).toLocaleDateString()} • Contact: ${patient.email}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentPatients;
