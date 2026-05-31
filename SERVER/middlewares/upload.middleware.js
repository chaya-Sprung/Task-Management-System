import multer from "multer";
import path from "path";

// הגדרת תיקייה לשמירת התמונות
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // תיקייה בשם uploads בתיקיית השרת
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});
