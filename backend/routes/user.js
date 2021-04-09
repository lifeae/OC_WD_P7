const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorization');
const multer = require('../middleware/multer-config');

router.get('/profile/:id', authentification, userCtrl.getProfile);
router.put('/profile/:id', authentification, authorization, multer, userCtrl.modifyProfile);
router.delete('/profile/:id', authentification, authorization, multer, userCtrl.deleteProfile);

module.exports = router;