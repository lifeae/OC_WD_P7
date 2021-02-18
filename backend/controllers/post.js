const postMdl = require("../models/post");

exports.getAllPosts = postMdl.getAllPosts;
exports.createPost = postMdl.createPost;
exports.getOnePost = postMdl.getOnePost;
exports.modifyPost = postMdl.modifyPost;
exports.deletePost = postMdl.deletePost;
exports.likePost = postMdl.likePost;