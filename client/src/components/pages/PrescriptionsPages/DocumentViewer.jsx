import { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from "react-pdf";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Edit as SignIcon,
  Approval as StampIcon,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { borderColor } from "@mui/system";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const DocumentViewer = ({ file, pageNumber, setPageNumber }) => {
  const [numPages, setNumPages] = useState(null);

  const changePage = (offset) => {
    setPageNumber((prev) => prev + offset);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (pageNumber > numPages) {
      setPageNumber(numPages);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "800px", // Adjust as needed
        margin: "0 auto",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "16px",
          "& .react-pdf__Page": {
            maxWidth: "100%",
            width: "100%",
          },
          "& .react-pdf__Page__canvas": {
            maxWidth: "100% !important",
            width: "100% !important",
            height: "auto !important",
          },
        }}
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth - 80, 750)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "16px",
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "8px 16px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          gap: "8px",
        }}
      >
        {/* Navigation Controls */}
        <IconButton onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
          <ChevronLeftIcon />
        </IconButton>

        <Typography sx={{ textAlign: "center" }}>
          Page {pageNumber} / {numPages || "--"}
        </Typography>

        <IconButton
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
        >
          <ChevronRightIcon />
        </IconButton>

        {/* Divider */}
        <Divider orientation="vertical" variant="middle" flexItem />

        {/* PDF Action Buttons */}
        <IconButton sx={{ zIndex: "10" }}>
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton sx={{ zIndex: "10" }}>
          <SignIcon fontSize="small" />
        </IconButton>
        <IconButton sx={{ zIndex: "10" }}>
          <StampIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DocumentViewer;
