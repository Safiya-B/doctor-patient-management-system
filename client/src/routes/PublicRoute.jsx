import { React } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { auth } = useAuth();

  if (auth === undefined) {
    console.log("undef");
    return null; // or loading indicator/spinner/etc...
  }

  return auth.accessToken ? (
    auth.user?.isAdmin ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/patient" replace />
    )
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
