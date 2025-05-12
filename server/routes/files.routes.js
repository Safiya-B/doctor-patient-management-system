const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middlewares/verifyRole");

const {
  UploadFiles,
  DownloadFile,
  DownloadUserFile,
  DeleteFiles,
  GetFiles,
} = require("../controllers/files.controller");
const upload = require("../middlewares/filesUpload");

router.route("/").get(verifyRole, GetFiles).delete(verifyRole, DeleteFiles);

router.post("/upload", verifyRole, upload.array("files", 10), UploadFiles);
router.route("/download/:fileId").get(verifyRole, DownloadFile);

router.get("/:fileName", DownloadUserFile);

module.exports = router;
