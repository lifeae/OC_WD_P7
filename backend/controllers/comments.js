const commentMdl = require('../models/comment');

exports.getOneComment = (req, res, next) => {
  commentMdl.getOneComment(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.getComments = (req, res, next) => {
  commentMdl.getComments(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.createComment = (req, res, next) => {
  commentMdl.createComment(req.user, req.body.text, req.body.id_post)
  .then(result => { res.status(200).json({result: result}) });
};

exports.modifyComment = (req, res, next) => {
  commentMdl.modifyComment(req.body.text, req.body.comment_id)
  .then(result => { res.status(200).json({result: result}) });
};

exports.deleteComment = (req, res, next) => {
  commentMdl.deleteComment(req.params.id)
  .then(result => { res.status(200).json({result: result}) });
};