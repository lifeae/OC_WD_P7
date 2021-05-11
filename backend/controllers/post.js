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
  postMdl.createPost(req.userId, req.body.text)
    .then(result => {
      res.status(200).json({ result: result });
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
  postMdl.modifyPost(req.body.text, req.params.id)
    .then(result => {
      res.status(200).json({ result: result });
    })
};

exports.deletePost = (req, res, next) => {
  postMdl.deletePost(req.params.id)
    .then(result => {
      res.status(200).json({ result: result });
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

