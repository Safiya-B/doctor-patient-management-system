import React from "react";
import { Box, Grid } from "@mui/material";
import DashboardCard from "./DashboardCard";
import { People, Assignment, VideoCall, Event } from "@mui/icons-material";
import Loading from "../Loading";
import useFetchUsers from "../../../hooks/useFetchUsers";
import RecentPatients from "./Patients/RecentPatients";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { users, loading } = useFetchUsers();
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  const cards = [
    {
      id: 0,
      title: "Patients",
      count: users.length,
      icon: People,
      iconColor: "#00897b",
      route: "patients",
    },
    {
      id: 1,
      title: "Prescriptions",
      count: 0,
      icon: Assignment,
      iconColor: "#1e88e5",
      route: "prescriptions",
    },

    {
      id: 2,
      title: "Consultations",
      count: 0,
      icon: VideoCall,
      iconColor: "#43a047",
      route: "consultations",
    },
    {
      id: 3,
      title: "Appointments",
      count: 0,
      icon: Event,
      iconColor: "#fb8c00",
      route: "appointments",
    },
  ];

  if (loading) return <Loading />;

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={4}>
        {cards.map(({ id, title, count, icon, iconColor, route }) => (
          <Grid item xs={12} md={6} lg={3} key={id}>
            <DashboardCard
              title={title}
              count={count}
              Icon={icon}
              iconColor={iconColor}
              onClick={() => handleCardClick(route)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6} lg={6}>
          <RecentPatients patients={users} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <div>Upcoming appointments</div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
