const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
const profilePicturesDir = path.join(uploadsDir, 'profile_pictures');
const bannersDir = path.join(uploadsDir, 'banners');

// Ensure all upload subdirectories exist on startup
[uploadsDir, profilePicturesDir, bannersDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Profile picture field names that should go into profile_pictures/
const PROFILE_FIELDS = ['avatar', 'profile_image', 'profile_picture'];

// Banner / venue image field names that should go into banners/
const BANNER_FIELDS = ['banner_image', 'image_url', 'venue_image'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (PROFILE_FIELDS.includes(file.fieldname)) {
      cb(null, profilePicturesDir);
    } else if (BANNER_FIELDS.includes(file.fieldname)) {
      cb(null, bannersDir);
    } else {
      // Fallback — keep in root uploads folder
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;
