import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RefreshProvider from "../context/RefreshContext";
import { VideoProvider } from "../context/VideoContext";
import "./route.css";
import UserDrawer from "../components/pages/UserDrawer";

const PrivateRoute = ({ closedDrawer }) => {
  const { auth } = useAuth();

  return auth?.accessToken ? (
    <RefreshProvider>
      <VideoProvider>
        {!closedDrawer ? (
          <div className="divContainer">
            <UserDrawer />
            <main className="mainContainer">
              <Outlet />
              {/* <Footer /> */}
            </main>
          </div>
        ) : (
          <Outlet />
        )}
      </VideoProvider>
    </RefreshProvider>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
