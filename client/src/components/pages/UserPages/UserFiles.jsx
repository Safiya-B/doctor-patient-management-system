import React from "react";

import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { FaRegFileImage } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";

const useStyles = {
  table: {
    //minWidth: 700,
  },
  title: {
    fontSize: 20,
    backgroundColor: "#90ce6e",
    color: "white",
  },
  downloadDiv: {
    display: "flex",
    alignItems: "center",
  },
  filename: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginLeft: "5px",
  },
  btn: {
    backgroundColor: "#fff",
    border: "1px solid #e53935",
    color: "#e53935",
    "&:hover": {
      backgroundColor: "#e539350d",
    },
  },
  btn2: {
    backgroundColor: "#fff",
    border: "1px solid #208895",
    color: "#208895",
    "&:hover": {
      backgroundColor: "#2088950a",
    },
  },
};

const useStyles1 = (theme) => ({
  root: {
    flexShrink: 0,
    //marginLeft: theme.spacing(2.5),
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

const UserFiles = ({ filesList }) => {
  const classes = useStyles();
  const auth = useAuth();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, filesList.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadFile = async (fileName) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      };
      const { data } = await axios.get(`/api/files/${fileName}`, config);
      const url = data.url;
      window.open(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.title} colSpan={5}>
              Mes Ordonnances
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Ordonnance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filesList.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : filesList
          )
            .sort((a, b) => {
              let x = a.split("/")[2].split("_")[1].split(".")[0];
              let y = b.split("/")[2].split("_")[1].split(".")[0];
              return y - x;
            })
            .map((url) => {
              const fileName = url.split("/")[2];
              const fileDate = fileName.split("_")[1].split(".")[0];
              const date = new Date(Number(fileDate))
                .toLocaleString()
                .split(",")[0];

              return (
                <TableRow key={fileDate}>
                  <TableCell align="left">{date}</TableCell>
                  <TableCell align="left">
                    {fileName.slice(-3) === "pdf" ? (
                      <Button
                        onClick={() => downloadFile(fileName)}
                        className={classes.btn}
                        startIcon={<VscFilePdf color="#e53935" />}
                      >
                        Télécharger
                      </Button>
                    ) : fileName.slice(-3) === "jpg" ||
                      fileName.slice(-3) === "png" ? (
                      <Button
                        onClick={() => downloadFile(fileName)}
                        className={classes.btn2}
                        startIcon={
                          <FaRegFileImage color="#208895"></FaRegFileImage>
                        }
                      >
                        Télécharger
                      </Button>
                    ) : (
                      <div>Fichier non reconnu</div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={filesList.length}
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

export default UserFiles;
