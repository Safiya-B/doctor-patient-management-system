import React, { useContext } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { CheckedDaysContext } from "../../../context/CheckedDaysContext";

const useStyles = (theme) => ({
  listItem: {
    padding: "20px",
  },
  container: {
    maxHeight: 500,
    overflow: "scroll",
    maxWidth: "100%",
  },
});

const TimeSlots = ({ timeSlots }) => {
  const classes = useStyles();
  const [checkedDays, setCheckDays] = useContext(CheckedDaysContext);

  const handleCheckDays = (e, day) => {
    const { value } = e.target;
    const isSelected = checkedDays[day].find((time) => time === value);
    if (!isSelected) {
      setCheckDays({ ...checkedDays, [day]: [...checkedDays[day], value] });
    } else
      setCheckDays({
        ...checkedDays,
        [day]: checkedDays[day].filter((time) => time !== value),
      });
  };

  const handleCheckedAll = (e, day) => {
    if (e.target.checked) setCheckDays({ ...checkedDays, [day]: timeSlots });
    else setCheckDays({ ...checkedDays, [day]: [] });
  };

  return (
    <Paper className={classes.container}>
      <Grid container wrap="nowrap">
        {Object.keys(checkedDays).map((day) => (
          <Grid item xs={12} key={day}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {day === "lundi" && <TableCell></TableCell>}
                  <TableCell align="center">
                    <div className={classes.headerCheckbox}>
                      <Typography variant="h6">{day}</Typography>
                      <Checkbox
                        color="primary"
                        checked={checkedDays[day].length === timeSlots.length}
                        onChange={(e) => handleCheckedAll(e, day)}
                        value={day}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((time) => {
                  return (
                    <TableRow key={time}>
                      {day === "lundi" && <TableCell>{time}</TableCell>}
                      <TableCell align="center">
                        <Checkbox
                          color="primary"
                          value={time}
                          checked={checkedDays[day].includes(time)}
                          onChange={(e) => handleCheckDays(e, day)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TimeSlots;
