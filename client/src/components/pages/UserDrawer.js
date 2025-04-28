import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import { BiHome, BiLogOut } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserDataContext";
import useLogout from "../../hooks/useLogout";
import useUserData from "../../hooks/useUserData";

const drawerWidth = 240;

const useStyles = (theme) => ({
  root: {
    display: "flex",
    position: "relative",
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  menuicon: {
    marginRight: "20px",
    fontSize: "20px",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#263238",
    color: "rgba(255,255,255,.7)",
  },
  typography: {
    fontFamily: "Lato",
    fontWeight: "700",
    fontSize: "21px",
    lineHeight: "1.3rem",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    fontSize: "15px",
    textAlign: "center",
    marginTop: "5px",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: green[500],
  },
  downArrow: {
    color: "#5d5d5d",
  },
  logo: {
    paddingTop: "20px",
  },
  sideIcon: {
    fontSize: "20px",
    color: "rgba(255,255,255,.7)",
  },
  profileImage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "30px",
  },
  profileTypography: {
    color: "#fff",
    display: "block",
    fontSize: "15px",
    fontWeight: "700",
    paddingTop: "5px",
    marginBottom: "5px",
  },
  listItemHover: {
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  },
  logout: {
    marginTop: "100px",
  },
  listItems: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

function UserDrawer({ window }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { user } = useUserData();
  const logout = useLogout();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  const profileRedirect = () => {
    navigate("/patient/profile");
  };

  const drawer = (
    <div className={classes.listItems}>
      <div>
        <div className={classes.logo}>
          <Typography variant="h6" classes={{ root: classes.typography }}>
            DR. JOHNSON
          </Typography>
          <p className={classes.description}>Medecin généraliste</p>
        </div>{" "}
        <div className={classes.profileImage}>
          <Avatar className={classes.large}>
            {user.lastName.split("")[0].toUpperCase()}
          </Avatar>
          <Typography classes={{ root: classes.profileTypography }}>
            {user.lastName} {user.firstName}
          </Typography>
        </div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem
            button
            classes={{ root: classes.listItemHover }}
            onClick={() => navigate("/patient")}
          >
            <ListItemIcon className={classes.sideIcon}>
              <BiHome />
            </ListItemIcon>
            <ListItemText primary={"Acceuil"} />
          </ListItem>
          <ListItem
            button
            classes={{ root: classes.listItemHover }}
            onClick={profileRedirect}
          >
            <ListItemIcon>
              <FaRegUser className={classes.sideIcon} />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItem>
          <ListItem button classes={{ root: classes.listItemHover }}>
            <ListItemIcon className={classes.sideIcon}>
              <FiInfo />
            </ListItemIcon>
            <ListItemText primary={"Informations"} />
          </ListItem>
        </List>
      </div>
      <div>
        <List>
          <ListItem
            button
            classes={{ root: classes.listItemHover }}
            onClick={signOut}
          >
            <ListItemIcon className={classes.sideIcon}>
              <BiLogOut />
            </ListItemIcon>
            <ListItemText primary={"Deconnexion"} />
          </ListItem>
        </List>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Tableau de bord
          </Typography>
          <ProfileMenu user="patient" />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: false, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default UserDrawer;
