const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// Setup multer for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }).array("images"); // Expect "images" field in form

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

const mapFiles = async (files) => {
  if (!Array.isArray(files) || files.length === 0) {
    console.warn("No files provided or files array is empty.");
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    try {
      const result = await uploadToCloudinary(file.buffer);
      return {
        name: file.originalname,
        type: file.mimetype,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return null;
    }
  });

  const mappedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
  return mappedFiles;
};

module.exports = { mapFiles };
