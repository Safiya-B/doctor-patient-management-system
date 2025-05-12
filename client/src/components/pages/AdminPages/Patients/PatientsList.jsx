import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import Loading from "../../Loading";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import SearchAppBar from "../../SearchAppBar";
import EditPatient from "./EditPatient";
import AddPatient from "./AddPatient";
import ReusableDialog from "../../ReusableDialog";
import useCheckbox from "../../../../hooks/useCheckbox";
import useDeleteItems from "../../../../hooks/useDeleteItems";

const PatientsList = () => {
  const { users, loading, fetchUsers } = useFetchUsers();
  const {
    selectedItems,
    handleSelectedItem,
    handleSelectAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  } = useCheckbox(users);
  const { handleDelete } = useDeleteItems("/api/users/delete", fetchUsers);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <Loading />;
  }
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
        <Typography variant="h5">Patients List</Typography>
        <AddPatient fetchUsers={fetchUsers} />
      </Box>
      <Box>
        <SearchAppBar
          placeholder="Search patients..."
          onSearch={setSearchQuery}
          showDeleteSection={true}
          selectedRows={selectedItems}
          onClick={handleOpen}
        />
        <ReusableDialog
          open={open}
          onClose={handleClose}
          title="Confirm Deletion"
          submitText="Confirm"
          cancelText="Cancel"
          onSubmit={() => handleDelete(selectedItems, setOpen, clearSelection)}
        >
          <Typography>
            Are you sure you want to delete the selected patient(s)?
          </Typography>
        </ReusableDialog>
        <TableContainer component={Paper} sx={{ borderRadius: "0 0 4px 4px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="secondary"
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedUsers.map((user) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="secondary"
                        inputProps={{ ledby: user._id }}
                        checked={selectedItems.includes(user._id)}
                        onChange={() => handleSelectedItem(user._id)}
                      />
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <EditPatient user={user} fetchUsers={fetchUsers} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count}`
            }
          />
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PatientsList;
