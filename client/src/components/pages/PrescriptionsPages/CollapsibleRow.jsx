import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete,
} from "@mui/icons-material";

import AddPrescription from "./AddPrescription";
import FilesTable from "./FilesTable";
import useDeleteItems from "../../../hooks/useDeleteItems";
import useCheckbox from "../../../hooks/useCheckbox";
import ReusableDialog from "../ReusableDialog";

const CollapsibleRow = ({ row, files, fetchFiles }) => {
  const [open, setOpen] = useState(false);
  const [openConfirmDeletion, setOpenConfirmDeletion] = useState(false);
  const {
    selectedItems,
    handleSelectedItem,
    handleSelectAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  } = useCheckbox(files);
  const { handleDelete } = useDeleteItems("/api/files");

  const handleOpenCollapsibleRow = () => setOpen(!open);

  return (
    <>
      {/* Parent Row */}
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={handleOpenCollapsibleRow}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.lastName} {row.firstName}
        </TableCell>
        <TableCell>
          <AddPrescription
            userId={row._id}
            lastName={row.lastName}
            firstName={row.firstName}
            fetchFiles={fetchFiles}
            setOpenRow={setOpen}
          />
        </TableCell>
      </TableRow>

      {/* Collapsible Content */}

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 1,
                  pb: 2,
                }}
              >
                <Typography variant="subtitle2">Uploaded Files</Typography>
                {selectedItems.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ mr: 2 }}
                    >
                      {selectedItems.length} record(s) selected for deletion
                    </Typography>
                    <ReusableDialog
                      open={openConfirmDeletion}
                      onClose={() => setOpenConfirmDeletion(false)}
                      title="Confirm Deletion"
                      submitText="Confirm"
                      cancelText="Cancel"
                      onSubmit={() =>
                        handleDelete(
                          selectedItems,
                          setOpenConfirmDeletion,
                          fetchFiles,
                          clearSelection
                        )
                      }
                    >
                      <Typography>
                        Are you sure you want to delete the selected file(s)?
                      </Typography>
                    </ReusableDialog>
                    <IconButton
                      sx={{
                        color: "error.main",
                      }}
                      aria-label="delete"
                      onClick={() => setOpenConfirmDeletion(true)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <FilesTable
                files={files}
                selectedItems={selectedItems}
                handleSelectedItem={handleSelectedItem}
                isAllSelected={isAllSelected}
                isIndeterminate={isIndeterminate}
                handleSelectAll={handleSelectAll}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
