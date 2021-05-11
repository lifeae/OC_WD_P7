const DEBUG = require('../debug');

if (DEBUG) console.log(`Entrée dans le middleware : multer-config.`);

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0].split(' ').join('_');
    
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

if (DEBUG) console.log(`Sortie du middleware : multer-config.`);

module.exports = multer({storage: storage}).single('picture');