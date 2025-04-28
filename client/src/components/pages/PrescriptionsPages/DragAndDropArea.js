import React from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  List,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getFileIcon } from "../utils/fileIconsHelper";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

const DragAndDropArea = ({ files, setFiles }) => {
  const handleDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the maximum size of 5MB.`);
        return false;
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      return true;
    });

    const uniqueFiles = validFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (uniqueFiles.length < validFiles.length) {
      toast.error("Duplicate files");
    }

    setFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
  });

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <Box>
      {/*Drag and drop area*/}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragActive ? "#4caf50" : "#cccccc"}`,
          borderRadius: 4,
          backgroundColor: isDragActive ? "#e8f5e9" : "#ffffff",
          textAlign: "center",
          padding: 4,
          cursor: "pointer",
          transition: "background-color 0.3s, border-color 0.3s",
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color="secondary" sx={{ fontSize: 48 }} />
        <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
          Drag & Drop files here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Maximum file size: 5MB
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          or
        </Typography>
        <Button color="secondary" variant="outlined" sx={{ mt: 1 }}>
          Browse Files
        </Button>
      </Box>
      {/* Files List */}
      {files.length > 0 && (
        <List sx={{ mt: 3 }}>
          {files.map((file) => (
            <ListItem
              key={file.name}
              secondaryAction={
                <IconButton
                  color="error"
                  edge="end"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemIcon>{getFileIcon(file.name)}</ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DragAndDropArea;
