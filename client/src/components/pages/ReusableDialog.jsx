import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
const ReusableDialog = ({
  dialogView,
  open,
  onClose,
  onGoBack,
  onSubmit,
  title,
  children,
  submitText,
  cancelText,
  showGoBack,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={dialogView === "edit" ? "md" : "sm"}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {cancelText && submitText && (
        <DialogActions sx={{ display: "flex" }}>
          {showGoBack && (
            <Box sx={{ flexGrow: 1 }}>
              <Button onClick={onGoBack}>Back</Button>
            </Box>
          )}
          <Button onClick={onClose} color="primary">
            {cancelText}
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained">
            {submitText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReusableDialog;
