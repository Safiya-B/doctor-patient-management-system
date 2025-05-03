import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import moment from "moment";
import { IconButton } from "@mui/material";

const StyledTableCell = withStyles((theme) => ({
  body: {
    fontSize: 15,
  },
}))(TableCell);

const useStyles = {
  title: {
    fontSize: 25,
    backgroundColor: "#76b852",
    color: "white",
  },
};

const useStyles1 = (theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
});

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const sortByDate = (a, b) => {
  return (
    new moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") -
    new moment(b.date, "DD-MM-YYYY").format("YYYYMMDD")
  );
};

const LastAppointments = ({ rows }) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [lastAppointments, setLastAppointments] = useState([]);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, lastAppointments.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (rows.length > 0)
      // assign user to each appointment and return the appointment array with the latest appointments
      setLastAppointments(
        rows
          .map((a) => a.appointments.map((i) => ({ ...i, user: a.user })))
          .flat()
          .sort(sortByDate)
          .reverse()
      );
  }, [rows]);

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.title} colSpan={5}>
              Derniers rendez-vous
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell align="left">lastName</StyledTableCell>
            <StyledTableCell align="left">firstName</StyledTableCell>
            <StyledTableCell align="left">Date</StyledTableCell>
            <StyledTableCell align="left">Heure</StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        {lastAppointments.length > 0 ? (
          <TableBody>
            {(rowsPerPage > 0
              ? lastAppointments.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : lastAppointments
            ).map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row?.user?.lastName}</TableCell>
                <TableCell>{row?.user?.firstName}</TableCell>
                <TableCell>{row?.date}</TableCell>
                <TableCell>{row?.time}</TableCell>
                <TableCell>
                  {row.cancelled
                    ? "annulé"
                    : row.ended
                    ? "terminé"
                    : "En attente"}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell align="center" colSpan={5}>
                Aucun Rendez-vous
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={lastAppointments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default LastAppointments;
