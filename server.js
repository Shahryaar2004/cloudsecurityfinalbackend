
const archiver = require("archiver");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const md5 = require("md5");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const upload = require("./multerconfig");
const User = require("./schema");
const generateOTP = require("./generateOtp");
const sendEmail = require("./sendEmail");
const otpEmailTemplate = require("./otpEmailTemplate");
const loginEmail = require("./loginEmail")
const otpStore = require("./otpstore");
const app = express();
const PORT = 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors()); 



app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "public")));




mongoose.connect(
  "mongodb+srv://bajwauser:qMxQINjBC5jfQi4Q@cluster0.xpip0mj.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("MongoDB connected to e_comdb"))
.catch(err => console.error("MongoDB connection error:", err));



const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dg0bpaofy",
  api_key: "131812724626533",
  api_secret: "ZtzWTO9asswmAd9G_lz3e0eBF-I",
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fileData = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,          
      cloudinaryId: req.file.filename  
    };

    user.files.push(fileData);
    await user.save();

    res.json({
      success: true,
      file: fileData
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});


app.get("/api/files/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/files/:email/:fileId", async (req, res) => {
  try {
    const { email, fileId } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const fileIndex = user.files.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) return res.status(404).json({ message: "File not found" });

    await cloudinary.uploader.destroy(user.files[fileIndex].cloudinaryId);

    user.files.splice(fileIndex, 1);
    await user.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


app.get("/api/files/download/:email/:fileId", async (req, res) => {
  try {
    const { email, fileId } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const file = user.files.find(f => f._id.toString() === fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const downloadUrl = file.filePath.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    res.redirect(downloadUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = upload; 

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, faceImage } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: md5(password),

      faceImage: faceImage || null,

      files: [] 
    });

    res.json({
      message: "Account created successfully",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔑 Compare hashed password
    if (user.password !== md5(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/send-otp", async (req, res) => {
  const { name, email, password, faceImage } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    userData: { name, email, password, faceImage },
    expiresAt: Date.now() + 10 * 60 * 1000, 
  };

  await sendEmail({
    to: email,
    subject: "Email Verification OTP",
    html: otpEmailTemplate(otp),
  });

  res.json({ otpSent: true });
});


app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.json({ verified: false, message: "OTP expired or not found" });
  if (record.otp !== otp) return res.json({ verified: false, message: "Incorrect OTP" });

  const userData = record.userData;
  delete otpStore[email]; 
  res.json({ verified: true, userData });
});
app.get("/api/files/download-all/:email", async (req, res) => { 
  const email = req.params.email;
  const userDir = path.join(__dirname, "uploads", email);

  if (!fs.existsSync(userDir)) {
    return res.status(404).json({ message: "No files found" });
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename=All_Files_${email}.zip`);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);
  archive.directory(userDir, false); 
  await archive.finalize(); 
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
