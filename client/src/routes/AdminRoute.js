import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RefreshProvider from "../context/RefreshContext";
import { SearchProvider } from "../context/SearchContext";
import { VideoProvider } from "../context/VideoContext";
import "./route.css";
import AdminDrawer from "../components/pages/AdminDrawer";
import { UsersProvider } from "../context/UsersContext";
import { Box } from "@mui/material";

const AdminRoute = () => {
  const { auth } = useAuth();

  return auth?.user?.isAdmin ? (
    <RefreshProvider>
      <VideoProvider>
        <SearchProvider>
          <UsersProvider>
            <Box sx={{ display: "flex" }}>
              <AdminDrawer />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: "100px",
                  height: "100vh",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Outlet />
              </Box>
            </Box>
          </UsersProvider>
        </SearchProvider>
      </VideoProvider>
    </RefreshProvider>
  ) : auth?.accessToken ? (
    <Navigate to="/patient" />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
