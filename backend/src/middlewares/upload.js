import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    "uploads",
    "uploads/profiles",
    "uploads/documents",
    "uploads/medical-records",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    if (file.fieldname === "profilePicture") {
      uploadPath += "profiles/";
    } else if (file.fieldname === "document") {
      uploadPath += "documents/";
    } else if (file.fieldname === "medicalRecord") {
      uploadPath += "medical-records/";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePicture") {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for profile pictures"), false);
    }
  } else if (
    file.fieldname === "document" ||
    file.fieldname === "medicalRecord"
  ) {
    // Allow documents and images
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"), false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

// Upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
});

// Upload middleware for different types
export const uploadProfile = upload.single("profilePicture");
export const uploadDocument = upload.single("document");
export const uploadMedicalRecord = upload.single("medicalRecord");
export const uploadMultiple = upload.array("files", 5);
