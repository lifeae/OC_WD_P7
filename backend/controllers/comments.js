const commentMdl = require('../models/comment');

exports.getOneComment = (req, res, next) => {
  commentMdl.getOneComment(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.getAllComments = (req, res, next) => {
  commentMdl.getAllComments(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.createComment = (req, res, next) => {
  commentMdl.createComment(req.userId, req.body.text, req.body.id_post)
  .then(result => { res.status(200).json({result: result}) });
};

exports.modifyComment = (req, res, next) => {
  commentMdl.modifyComment(req.params.id, req.body.text)
  .then(result => { res.status(200).json({result: result}) });
};

exports.deleteComment = (req, res, next) => {
  commentMdl.deleteComment(req.params.id)
  .then(result => { res.status(200).json({result: result}) });
};