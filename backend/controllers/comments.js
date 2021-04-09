const commentMdl = require('../models/comment');

exports.createComment = (req, res, next) => {
  let id_post = 9 // A DEGAGER lorsque le frontend communiquera le post sur lequel la personne commente
  // (soit dans les req.params.id soit dans le champ rempli qui doit nous renvoyer une information sur le post ciblé)
  commentMdl.createComment(req.user, req.body.text, id_post)
  .then(result => { res.status(200).json({result: result}) });
};

exports.modifyComment = (req, res, next) => {
  commentMdl.modifyComment(req.body.text, req.params.id)
  .then(result => { res.status(200).json({result: result}) });
};

exports.deleteComment = (req, res, next) => {
  commentMdl.deleteComment(req.params.id)
  .then(result => { res.status(200).json({result: result}) });
};