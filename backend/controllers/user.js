const userMdl = require('../models/user');
const DEBUG = require('../debug');
const fs = require('fs')

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
  let picture;
  userMdl.getProfile(req.params.id)
    .then(result => result[0])
    .then(user => {
      if (req.file !== undefined) { // L'utilisateur a envoyé une image
        if (user.picture !== "") {
          // Supprimer l'ancienne image de l'API
          fs.unlink(`./images/${user.picture.split("/images/")[1]}`, (err) => {
            if (err) throw err;
          });
        }
        // Mettre la nouvelle
        picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        userMdl.modifyProfile(req.body.firstname, req.body.lastname, req.body.email, picture, req.body.position, req.body.phone, req.params.id)
          .then(result => {
            res.status(200).json({ result: result });
            return;
          })
      } else {
        userMdl.modifyProfile(req.body.firstname, req.body.lastname, req.body.email, user.picture, req.body.position, req.body.phone, req.params.id)
          .then(result => {
            res.status(200).json({ result: result });
            return;
          })
      }
    })

};

exports.deleteProfile = (req, res, next) => {
  userMdl.getProfile(req.params.id)
    .then(result => result[0])
    .then(user => {
      // Suppression de l'image
      // S'il y en a une !
      if (user.picture !== "") {
        fs.unlink(`./images/${user.picture.split("/images/")[1]}`, (err) => {
          if (err) throw err;
        });
      }
      userMdl.deleteProfile(req.params.id)
        .then(result => {
          res.status(200)
            .json({ result: result });
          return;
        })
    })
};