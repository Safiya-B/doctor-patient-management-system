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
} from "@mui/material";
import { getFileIcon } from "../utils/fileIconsHelper";
import axios from "../../../api/axios";

const FilesTable = ({
  files,
  selectedItems,
  handleSelectedItem,
  isAllSelected,
  isIndeterminate,
  handleSelectAll,
}) => {
  const handleDownload = async (fileId) => {
    try {
      const { data } = await axios.get(`/api/files/${fileId}`);

      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        {files.length > 0 && (
          <TableHead sx={{ backgroundColor: "#ffff" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="secondary"
                  size="small"
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>File</TableCell>
              <TableCell>Uploaded at</TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {files.length > 0 ? (
            files.map((file) => (
              <TableRow key={file._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="secondary"
                    size="small"
                    checked={selectedItems.includes(file._id)}
                    onChange={() => handleSelectedItem(file._id)}
                  />
                </TableCell>
                <TableCell
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box>{getFileIcon(file.fileName)}</Box>
                  <Typography
                    onClick={() => handleDownload(file._id)}
                    variant="subtitle2"
                    sx={{
                      cursor: "pointer",
                      ml: 1,
                      transition: "color 0.3s, transform 0.2s",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "black",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {file.fileName}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ padding: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  This user has no files at the moment.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTable;
