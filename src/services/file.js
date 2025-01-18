const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const mapFiles = async (files) => {
  if (!Array.isArray(files) || files.length === 0) {
    console.warn("No files provided or files array is empty.");
    return [];
  }

  const uploadPromises = files.map(async (fls) => {
    const { name, type, url } = fls || {};
    if (url && typeof url === "string") {
      const publicId = name || `file_${Date.now()}`;
      try {
        const uploadedFile = await cloudinary.uploader.upload(url, {
          public_id: publicId,
        });
        return { name, type, url: uploadedFile.secure_url };
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return null;
      }
    } else {
      console.warn("Skipping file with missing or invalid url:", fls);
      return null;
    }
  });

  const mappedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
  return mappedFiles;
};

module.exports = { mapFiles };
