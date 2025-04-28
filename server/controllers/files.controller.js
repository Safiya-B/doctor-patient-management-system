const User = require("../models/Users");
const File = require("../models/Files");
const ErrorResponse = require("../utils/ErrorResponse");
const sanitizeFilename = require("sanitize-filename");
const { uploadFileToS3 } = require("../utils/s3Utils");

const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/awsClient");

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
  try {
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: "Patients/" + req.params.folderName + "/" + req.params.fileName,
      Expires: 60,
    });
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

    const keys = files.map((file) => ({ Key: file.filePath }));

    res.json({
      success: "Files deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }

  /*  try {
    const { Deleted } = await s3.send(
      new DeleteObjectsCommand({
        Bucket: process.env.BUCKET_NAME,
        Delete: {
          Objects: files.map((fileId) => ({ Key: k })),
        },
      })
    );
  } catch (error) {
    
  } */

  /* const userID = req.params.folderName.split("_")[0];
  const filePath =
    "Patients/" + req.params.folderName + "/" + req.params.fileName;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  // if there is only 1 file left on the folder, delete the folder

  try {
    const user = await User.findOne({ _id: userID });

    if (!user) return next(new ErrorResponse("no user", 404));
    // if there is only 1 file left in the folder, delete the folder

    if (user.filesList.length === 1) {
      const folderPath = "Patients/" + req.params.folderName;
      const folderParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: folderPath,
      };
      s3.deleteObject(folderParams, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
      });
    }
    user.filesList.pull(filePath);
    await user.save();
    return res.json({
      success: `Le fichier a bien été supprimé`,
    });
  } catch (error) {
    return next(error);
  } */
};
