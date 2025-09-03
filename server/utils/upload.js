const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = "uploads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  // allow pdf/doc/docx/images for resumes or logos
  const allowed = /pdf|doc|docx|png|jpg|jpeg/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) cb(null, true); else cb(new Error("Unsupported file type"));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
