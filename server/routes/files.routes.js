const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middlewares/verifyRole");

const {
  UploadFiles,
  DownloadS3File,
  DownloadUserFile,
  DeleteFiles,
  GetFiles,
  GetPrescriptionAsset,
} = require("../controllers/files.controller");
const upload = require("../middlewares/filesUpload");

router.route("/").get(verifyRole, GetFiles).delete(verifyRole, DeleteFiles);
router.post("/", verifyRole, upload.array("files", 10), UploadFiles);
router.route("/assets").get(verifyRole, GetPrescriptionAsset);

router.route("/:fileId").get(verifyRole, DownloadS3File);
router.get("/:fileName", DownloadUserFile);

module.exports = router;
