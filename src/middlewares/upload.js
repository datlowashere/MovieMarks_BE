const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/upload/"); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
      cb(null, Date.now() + "-" + filename); 
    },
  });
  
  const upload = multer({ storage: storage });

module.exports = upload;