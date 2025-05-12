const User = require("../models/Users");
const File = require("../models/Files");
const ErrorResponse = require("../utils/ErrorResponse");
const sanitizeFilename = require("sanitize-filename");
const {
  uploadFileToS3,
  deleteS3Object,
  generateS3Url,
} = require("../utils/s3Utils");

exports.UploadFiles = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return next(new ErrorResponse("No files provided", 400));
    }

    // Validate user existence
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Promise.all for concurrent file uploads
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const timestamp = Date.now();
        const sanitizedFilename = sanitizeFilename(file.originalname);
        const filePath = `Patients/${user.id}_${user.lastName}/${timestamp}_${sanitizedFilename}`;

        // Check for duplicate file
        if (user.filesList.includes(filePath)) {
          throw new ErrorResponse(`${file.originalname} already exists`, 400);
        }

        // Upload file to S3
        const result = await uploadFileToS3(
          file.buffer,
          filePath,
          file.mimetype
        );

        await File.create({
          userId: user._id,
          filePath,
          fileName: file.originalname,
          fileSize: file.size,
        });

        // Return the file path for further processing
        return filePath;
      })
    );

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

exports.GetFiles = async (req, res, next) => {
  try {
    // Fetch all files and populate user details
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json({ files });
  } catch (error) {
    next(error);
  }
};

exports.DownloadFile = async (req, res, next) => {
  const file = await File.findById(req.params.fileId);

  if (!file) return next(new ErrorResponse("File not found", 400));

  try {
    const url = await generateS3Url(file.filePath);

    res.json({ url });
  } catch (error) {
    return next(error);
  }
};

exports.DownloadUserFile = async (req, res, next) => {
  const userID = req.user._id;
  const name = req.user.lastName;

  try {
    const url = await userS3.getSignedUrlPromise("getObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: "Patients/" + userID + "_" + name + "/" + req.params.fileName,
      Expires: 60,
    });
    res.json({ url });
  } catch (error) {
    return next(error);
  }
};

exports.DeleteFiles = async (req, res, next) => {
  const { ids } = req.body;

  try {
    const files = await File.find({ _id: { $in: ids } });

    if (!files) return next(new ErrorResponse("no files to delete", 400));

    // Delete from DB

    await File.deleteMany({ _id: { $in: ids } });

    // Delete from s3

    const keys = files.map((file) => ({ Key: file.filePath }));

    const { Deleted } = await deleteS3Object(keys);

    res.status(200).json({
      success: true,
      message: "Files deleted successfully",
      deletedFiles: Deleted,
    });
  } catch (error) {
    return next(error);
  }
};
