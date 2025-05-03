//import { PictureAsPdf, Image, InsertDriveFile } from "@mui/icons-material";
import { FaRegFilePdf, FaFileImage, FaFile } from "react-icons/fa";

export const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return <FaRegFilePdf color="red" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <FaFileImage color="green" />;
    default:
      return <FaFile color="blue" />;
  }
};
