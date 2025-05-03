import React, { useContext } from "react";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useFetchUser from "../../../hooks/useFetchUser";
import { Link } from "react-router-dom";

const useStyles = {
  cardPadding: {
    padding: "10px 0px 15px 15px",
  },
};

export default function UserCard() {
  const classes = useStyles();
  const { user } = useFetchUser();

  return user.waitingRoom ? (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Téléconsultation en attente
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            Le docteur B. vous a ajouté pour une téléconsultation.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions classes={{ root: classes.cardPadding }}>
        <Link to="/teleconsultation/video" className={classes.joinLink}>
          <Button variant="outlined" color="primary">
            Rejoindre
          </Button>
        </Link>
      </CardActions>
    </Card>
  ) : (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Téléconsultation en attente
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Aucune téléconsultation en attente pour le moment.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
