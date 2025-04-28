import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
/* import PrivateRoute from "./routes/PrivateRoute";
 */ import AdminRoute from "./routes/AdminRoute";
import PersistLogin from "./routes/PersistLogin";
import LoginPage from "./components/Authentication/LoginPage";
import SignUpPage from "./components/Authentication/SignUpPage";
import { ToastContainer } from "react-toastify";
import ForgotPasswordPage from "./components/Authentication/ForgotPasswordPage";
import ResetPasswordPage from "./components/Authentication/ResetPasswordPage";
import NotFound from "./components/pages/NotFound";
import AdminPage from "./components/pages/AdminPages/AdminPage";

/*
import VideoSettingPage from "./components/pages/VideoCalls/VideoSettingPage";
import EndCall from "./components/pages/VideoCalls/EndCall";

import UserPage from "./components/pages/UserPages/UserPage";
import PatientsListPage from "./components/pages/AdminPages/Patients/PatientsListPage";
import OrdonnancesPage from "./components/pages/OrdonnancesPages/OrdonnancesPage";
import Consultations from "./components/pages/VideoCalls/Consultations";
import PatientConsultation from "./components/pages/UserPages/PatientVideo/PatientConsultation";
import Profile from "./components/pages/Profile";
import RendezVous from "./components/pages/Rendez-vous/RendezVous";
import PatientRendezVous from "./components/pages/UserPages/Rendez-Vous/PatientRendezVous";*/
import PublicRoute from "./routes/PublicRoute";
import PatientsList from "./components/pages/AdminPages/Patients/PatientsList";
import PrescriptionsPage from "./components/pages/PrescriptionsPages/PrescriptionsPage";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        role="alert"
      />
      <Router>
        <Routes>
          {/* public routes */}

          <Route element={<PublicRoute />}>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route
              path="/resetpassword/:resetToken"
              element={<ResetPasswordPage />}
            />
          </Route>

          {/* Admin routes */}
          <Route element={<PersistLogin />}>
            <Route path="/dashboard" element={<AdminRoute />}>
              <Route index element={<AdminPage />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="prescriptions" element={<PrescriptionsPage />} />
              {/*  <Route path="teleconsultations" element={<Consultations />} />
              <Route path="profile" element={<Profile />} />
              <Route path="rendez-vous" element={<RendezVous />} />*/}
            </Route>
            {/* private routes */}

            {/*   <Route path="/patient" element={<PrivateRoute />}>
              <Route index element={<UserPage />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="teleconsultations"
                element={<PatientConsultation />}
              />
              <Route path="rendez-vous" element={<PatientRendezVous />} />
            </Route> */}

            {/* Shared routes */}

            {/*    <Route
              path="/teleconsultation"
              element={<PrivateRoute closedDrawer />}
            >
              <Route path="video" element={<VideoSettingPage />} />
              <Route exact path="fin" element={<EndCall />} />
            </Route> */}
            {/*  */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
