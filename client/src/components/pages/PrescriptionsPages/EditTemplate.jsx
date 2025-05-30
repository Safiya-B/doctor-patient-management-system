import React, { useEffect, useState } from "react";
import DocumentViewer from "./DocumentViewer";
import { useSignedUrl } from "../../../hooks/useSignedUrl";
import Loading from "../Loading";

const EditTemplate = () => {
  const { fileUrl, loading } = useSignedUrl({ assetType: "template" });
  const [pageNumber, setPageNumber] = useState(1);

  if (loading) return <Loading />;

  return (
    <div>
      <DocumentViewer
        file={fileUrl}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

export default EditTemplate;
