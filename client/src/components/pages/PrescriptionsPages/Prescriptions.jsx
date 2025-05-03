import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import SearchAppBar from "../SearchAppBar";
import useFetchFiles from "../../../hooks/useFetchFiles";
import CollapsibleRow from "./CollapsibleRow";

// Main Prescriptions Component
const Prescriptions = ({ rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const { files, loading, fetchFiles } = useFetchFiles();

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = rows.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Box
      sx={{
        width: "100%",
        padding: 5,
        display: "flex",
        gap: 3,
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Prescriptions</Typography>
      </Box>
      <Box>
        <SearchAppBar onSearch={setSearchQuery} />
        <TableContainer component={Paper} sx={{ borderRadius: "0 0 4px 4px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Patient Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const userFiles = files.filter(
                    (obj) => obj.userId === user._id
                  );
                  return (
                    <CollapsibleRow
                      key={user._id}
                      row={user}
                      files={userFiles}
                      fetchFiles={fetchFiles}
                    />
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} of ${count}`
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Prescriptions;
