
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Create uploads folder if it doesn't exist
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// // Allowed MIME types and extensions
// const allowedMimes = [
//   "image/jpeg", "image/png", "image/gif", "image/webp",
//   "video/mp4", "video/webm",
//   "application/pdf", "text/plain"
// ];
// const allowedExtensions = [
//   ".jpg", ".jpeg", ".png", ".gif", ".webp",
//   ".mp4", ".webm",
//   ".pdf", ".txt"
// ];

// // Max file size 20 MB
// const maxSize = 20 * 1024 * 1024;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
// });

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();

//   // MIME & extension check
//   if (!allowedMimes.includes(file.mimetype)) {
//     return cb(new Error("File type not allowed (invalid MIME type)"));
//   }
//   if (!allowedExtensions.includes(ext)) {
//     return cb(new Error("File type not allowed (invalid extension)"));
//   }

//   // Forbidden dangerous extensions
//   const forbiddenExts = [".exe", ".bat", ".cmd", ".sh", ".js", ".msi", ".scr", ".com"];
//   if (forbiddenExts.includes(ext)) {
//     return cb(new Error("Forbidden file type"));
//   }

//   cb(null, true);
// };

// // Export multer instance
// module.exports = multer({ storage, fileFilter, limits: { fileSize: maxSize } });
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
   cloud_name: "dg0bpaofy",
  api_key: "131812724626533",
  api_secret: "ZtzWTO9asswmAd9G_lz3e0eBF-I",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "test_uploads",
    resource_type: "auto",   // 🔴 THIS FIXES 500 ERROR
    public_id: Date.now() + "-" + file.originalname,
  }),
});

const upload = multer({ storage });

module.exports = upload;
