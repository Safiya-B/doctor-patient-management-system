import { useDropzone } from "react-dropzone";

const useFileDropzone = ({ onFilesUploaded, accept, maxFiles }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("Files dropped: ", acceptedFiles);
      onFilesUploaded(acceptedFiles);
    },
    accept: accept || {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: maxFiles || 1,
  });

  return { getRootProps, getInputProps, isDragActive };
};

export default useFileDropzone;
