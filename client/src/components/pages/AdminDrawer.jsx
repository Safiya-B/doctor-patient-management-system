import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { useTheme, useMediaQuery, Toolbar } from "@mui/material";
import { green } from "@mui/material/colors";
import {
  FiVideo,
  FiCalendar,
  FiUser,
  FiFile,
  FiHome,
  FiLogOut,
} from "react-icons/fi";
import ProfileMenu from "./ProfileMenu";
import { useLocation, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useUserData from "../../hooks/useUserData";
import logo from "../../assets/images/doc-logo.png";
import { Stack } from "@mui/system";

const drawerWidth = 280;

const navItems = [
  {
    text: "Home",
    icon: <FiHome />,
    route: "",
  },
  { text: "Patients", icon: <FiUser />, route: "patients" },
  { text: "Prescriptions", icon: <FiFile />, route: "prescriptions" },
  { text: "Appointments", icon: <FiCalendar />, route: "appointments" },
  {
    text: "Video Consultations",
    icon: <FiVideo />,
    route: "video-consultations",
  },
];

function AdminDrawer({ window }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUserData();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <Stack spacing={3} sx={{ padding: "16px" }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              alignSelf: "center",
              height: "auto",
              maxWidth: "180px",
              padding: "10px",
              cursor: "pointer",
            }}
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              borderRadius: "12px",
              padding: "8px",
              border: "1px solid #434a60",
              backgroundColor: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                backgroundColor: green[500],
                borderRadius: "8px",
              }}
            >
              {user.lastName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography noWrap>
              {user.lastName} {user.firstName}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <List
          sx={{
            "& .MuiListItemButton-root": {
              transition: (theme) =>
                theme.transitions.create("background-color", {
                  duration: theme.transitions.duration.standard,
                  easing: theme.transitions.easing.easeIn,
                }),
              "&:hover": { bgcolor: "primary.main" },
            },
          }}
        >
          {navItems.map((item) => {
            const isSelected =
              location.pathname ===
              (item.route ? `/dashboard/${item.route}` : `/dashboard`);
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.route)}
                selected={isSelected}
                sx={{
                  pl: 2,
                  margin: "10px",
                  gap: 2,
                  pr: 1.5,
                  borderRadius: 0.75,
                  fontWeight: 500,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  },
                }}
              >
                <Box component="span">{item.icon}</Box>
                <Box component="span" flexGrow={1}>
                  {item.text}
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <List>
        <ListItem onClick={signOut}>
          <ListItemButton>
            <ListItemIcon sx={{ color: "inherit" }}>
              <FiLogOut />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#ffff",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="text.primary">
              Dashboard
            </Typography>
          </Box>
          <ProfileMenu user={user} />
        </Toolbar>
        <Divider sx={{ opacity: 0.2 }} />
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default AdminDrawer;
