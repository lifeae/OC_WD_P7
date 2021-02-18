const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/profile/:id', auth, userCtrl.getProfile);
router.put('/profile/:id', auth, multer, userCtrl.modifyProfile);
router.delete('/profile/:id', auth, multer, userCtrl.deleteProfile);

module.exports = router;