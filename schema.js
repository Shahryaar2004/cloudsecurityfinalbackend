
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  filePath: String,       
  cloudinaryId: String,   
  uploadedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  faceImage: {
    type: String,      
    select: false      
  },

  files: [fileSchema] 
});

const User = mongoose.model("usersdatas", userSchema);
module.exports = User;
