import { React } from "react";
import Prescriptions from "./Prescriptions";
import { Grid } from "@mui/material";
import useFetchUsers from "../../../hooks/useFetchUsers";
import Loading from "../Loading";

const PrescriptionsPage = () => {
  const { users, loading } = useFetchUsers();

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Prescriptions rows={users} />
        </Grid>
      </Grid>
    </div>
  );
};

export default PrescriptionsPage;
