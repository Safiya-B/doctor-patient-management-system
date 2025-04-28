import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import { IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const useStyles = (theme) => ({
  document: {
    width: "fit-content",
    boxShadow: "0 30px 40px 0px rgb(16 36 94 / 20%)",
  },
  page: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  controlButtons: {
    display: "flex",
    position: "relative",
    justifyContent: "center",
  },
  pageNumber: {
    paddingTop: "12px",
  },
  save: {
    display: "flex",
    justifyContent: "end",
    padding: "10px",
  },
});

// Create Document Component
const DocumentViewer = ({ file, pageNumber, setPageNumber }) => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);

  const changePage = (offSet) => {
    setPageNumber((prev) => prev + offSet);
  };

  const previous = () => {
    changePage(-1);
  };

  const next = () => {
    changePage(1);
  };

  return (
    <div>
      <Document
        className={classes.document}
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} className={classes.page} />
        <div className={classes.controlButtons}>
          <IconButton onClick={previous} disabled={pageNumber <= 1}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography className={classes.pageNumber}>
            page {pageNumber}/{numPages}
          </Typography>
          <IconButton onClick={next} disabled={pageNumber >= numPages}>
            <ChevronRightIcon />
          </IconButton>
        </div>
      </Document>
    </div>
  );
};

export default DocumentViewer;
