import React, { useState } from "react";
import {
  IconButton,
  Typography,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ReusableDialog from "../ReusableDialog";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import DragAndDropArea from "./DragAndDropArea";
import EditTemplate from "./EditTemplate";
import { toast } from "react-toastify";
import axios from "../../../api/axios";

const AddPrescription = ({
  firstName,
  lastName,
  userId,
  setOpenRow,
  fetchFiles,
}) => {
  const [open, setOpen] = useState(false);
  const [dialogView, setDialogView] = useState("home");
  const [files, setFiles] = useState([]);

  const handleClickOpen = () => setOpen(true);

  const handleViewChange = (view) => {
    setDialogView(view);
  };

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
  };

  const handleSubmitFile = async () => {
    if (files.length === 0) {
      toast.error("No files to upload!");
      return;
    }

    try {
      const formData = new FormData();

      // Append files to FormData
      files.forEach((file) => formData.append("files", file));

      // Append userId to FormData
      formData.append("userId", userId); // Add the userId from props

      // Backend API call for uploading files
      const response = await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Files uploaded successfully!");
      fetchFiles();
      // open collapsible row
      setOpenRow(true);

      handleClose(); // Close the dialog on success
    } catch (error) {
      toast.error("Failed to upload files.");
      console.error(error.response.data.error || "couldn't upload files");
    }
  };

  return (
    <>
      <IconButton color="secondary" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <ReusableDialog
        open={open}
        onClose={handleClose}
        title={`Add prescription for ${firstName} ${lastName}`}
        cancelText={dialogView !== "home" && "Cancel"}
        submitText={dialogView !== "home" && "Submit"}
        showGoBack={dialogView !== "home"}
        onGoBack={() => handleViewChange("home")}
        onSubmit={handleSubmitFile}
      >
        {dialogView === "home" && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Choose an option:
            </Typography>
            <Box>
              <List>
                <ListItemButton
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    mb: 2,
                  }}
                  onClick={() => handleViewChange("upload")}
                >
                  <ListItemText
                    primary="Add New Files"
                    secondary="Upload new PDF or images"
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  onClick={() => handleViewChange("edit")}
                >
                  <ListItemText
                    primary="Add content to the default prescription template"
                    secondary="Use an existing PDF prescription template and add content to it."
                  />
                </ListItemButton>
              </List>
            </Box>
          </Box>
        )}

        {dialogView === "upload" && (
          <DragAndDropArea files={files} setFiles={setFiles} />
        )}

        {dialogView === "edit" && <EditTemplate />}
      </ReusableDialog>
    </>
  );
};

export default AddPrescription;
