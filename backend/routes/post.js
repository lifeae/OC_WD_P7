const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const authentification = require('../middleware/authentification');
const authorization = require('../middleware/authorization');
const multer = require('../middleware/multer-config');

router.get('/', authentification, postCtrl.getAllPosts);
router.post('/', authentification, multer, postCtrl.createPost);
router.get('/:id', authentification, postCtrl.getOnePost);
router.put('/:id', authentification, authorization, multer, postCtrl.modifyPost);
router.delete('/:id', authentification, authorization, multer, postCtrl.deletePost);
router.post('/:id/react', authentification, postCtrl.reactToPost);

module.exports = router;