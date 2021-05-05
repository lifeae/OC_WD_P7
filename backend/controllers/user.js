const userMdl = require('../models/user');

exports.getProfile = (req, res, next) => {
  userMdl.getProfile(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.modifyProfile = (req, res, next) => {
  let picture = "";
  if (req.file !== undefined) {
    picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  userMdl.modifyProfile(req.body.firstname, req.body.lastname, req.body.email, picture, req.body.position, req.body.phone, req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};

exports.deleteProfile = (req, res, next) => {
  userMdl.deleteProfile(req.params.id)
  .then(result => {
    res.status(200).json({result: result});
  })
};