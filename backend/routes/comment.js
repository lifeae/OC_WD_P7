const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comments');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorization');
const multer = require('../middleware/multer-config');

router.post('/', authentification, commentCtrl.createComment);
router.get('/:id', authentification, commentCtrl.getComments);
router.put('/:id', authentification, authorization, commentCtrl.modifyComment);
router.delete('/:id', authentification, authorization, commentCtrl.deleteComment);

module.exports = router;