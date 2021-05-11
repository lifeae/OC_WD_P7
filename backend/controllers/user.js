const userMdl = require('../models/user');
const DEBUG = require('../debug');


exports.getProfile = (req, res, next) => {
  userMdl.getProfile(req.params.id)
    .then(result => {
      res.status(200).json({
        result: result,
        userId: req.userId,
        userIsConnected: req.userIsConnected,
        userIsAdmin: req.userIsAdmin,
      });
      return;
    })
};

exports.modifyProfile = (req, res, next) => {
  console.log(req.headers, req.file, req.body);
  let picture;
  if (req.file !== undefined) {
    picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  } else {
    picture = null;
  }
  userMdl.modifyProfile(req.body.firstname, req.body.lastname, req.body.email, picture, req.body.position, req.body.phone, req.params.id)
    .then(result => {
      res.status(200).json({ result: result });
      return;
    })
};

exports.deleteProfile = (req, res, next) => {
  userMdl.deleteProfile(req.params.id)
    .then(result => {
      res.status(200).json({ result: result });
      return;
    })
};