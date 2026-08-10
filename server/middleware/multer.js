import multer from "multer";
import os from "os";
import path from "path";

// ======================================================
// MULTER STORAGE
// ======================================================

const storage = multer.diskStorage({

  // Use the operating system's temporary directory
  // This works locally AND on Render
  destination: (req, file, cb) => {

    cb(null, os.tmpdir());

  },

  // Generate a unique filename
  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    const extension =
      path.extname(file.originalname);

    cb(
      null,
      uniqueName + extension
    );

  },

});


// ======================================================
// MULTER
// ======================================================

const upload = multer({

  storage,

});


// ======================================================
// EXPORT
// ======================================================

export default upload;