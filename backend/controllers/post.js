const postMdl = require('../models/post');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnection = require('../dbConnection');

exports.getAllPosts = (req, res, next) => {
  postMdl.getAllPosts()
    .then(result => {
      res.status(200).json({
        result: result,
        userId: req.userId,
        userIsConnected: req.userIsConnected,
        userIsAdmin: req.userIsAdmin,
        userIsOwner: req.userIsOwner
      });
    })
};

exports.createPost = (req, res, next) => {
  console.log(req.body, req.file)
  let illustration;
  if (req.file !== undefined) { // L'utilisateur a envoyé une image
    illustration = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  postMdl.createPost(req.userId, req.body.text, illustration)
    .then(result => result[0])
    .then(result => {
      res.status(200).json({
        result: result
      })
    })
};

exports.getOnePost = (req, res, next) => {
  postMdl.getOnePost(req.params.id)
    .then(result => {
      res.status(200).json({
        result: result,
        userId: req.userId,
        userIsConnected: req.userIsConnected,
        userIsAdmin: req.userIsAdmin,
        userIsOwner: req.userIsOwner
      });
    })
};

exports.modifyPost = (req, res, next) => {
  let illustration;
  postMdl.getOnePost(req.params.id)
    .then(result => result[0])
    .then(post => {
      if (req.file !== undefined) { // L'utilisateur a envoyé une image
        if (post.illustration !== "") {
          // Supprimer l'ancienne image de l'API
          // S'il y en avait une !
          fs.unlink(`./images/${post.illustration.split("/images/")[1]}`, (err) => {
            if (err) throw err;
          });
        }
        // Mettre la nouvelle
        illustration = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        postMdl.modifyPost(req.body.text, req.params.id, illustration)
          .then(result => {
            res.status(200).json({ result: result });
            return;
          })
      } else {
        postMdl.modifyPost(req.body.text, req.params.id, post.illustration)
          .then(result => {
            res.status(200).json({ result: result });
            return;
          })
      }
    })
};

exports.deletePost = (req, res, next) => {
  postMdl.getOnePost(req.params.id)
    .then(result => result[0])
    .then(post => {
      // Suppression de l'image du post
      // S'il y en a une !
      console.log(post.illustration);
      if (post.illustration !== "") {
        fs.unlink(`./images/${post.illustration.split("/images/")[1]}`, (err) => {
          if (err) throw err;
        });
      }
      postMdl.deletePost(req.params.id)
        .then(result => {
          res.status(200)
            .json({ result: result });
          return;
        })
    })
};

exports.reactToPost = (req, res, next) => {
  let isUserAlreadyReacted = (postMdl.isUserAlreadyReacted(req.userId, req.params.id));
  if (isUserAlreadyReacted) {
    postMdl.modifyReaction(req.body.reaction, req.userId, req.params.id)
      .then(result => {
        res.status(200).json({ result: result });
      })
  } else {
    postMdl.createReaction(req.body.reaction, req.userId, req.params.id)
      .then(result => {
        res.status(200).json({ result: result });
      })
  }
};

