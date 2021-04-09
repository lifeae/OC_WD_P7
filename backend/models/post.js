const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnection = require('../dbConnection');

exports.getAllPosts = () => {
  return new Promise((res, rej) => {
    let sqlQuery = "SELECT * FROM posts ;";
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    })
  })
};

exports.createPost = (userId, text) => {
  return new Promise((res, rej) => {
    let sqlQuery = "INSERT INTO posts (id_user, text, datetime) VALUES (?, ?, CURRENT_TIMESTAMP);";
    sqlQuery = mysql.format(sqlQuery, [userId, text]);
    console.log(userId, text);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.getOnePost = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "SELECT * FROM posts WHERE id= ?;";
    sqlQuery = mysql.format(sqlQuery, postId);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.modifyPost = (text, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "UPDATE posts SET text= ? WHERE posts.id= ? ;";
    sqlQuery = mysql.format(sqlQuery, [text, postId]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Post modifié !');
    });
  })
};

exports.deletePost = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "DELETE FROM posts WHERE posts.id = ?;";
    sqlQuery = mysql.format(sqlQuery, postId);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Post supprimé !');
    });
  })
};

exports.isUserAlreadyReacted = (userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "SELECT * FROM likes WHERE id_user= ? id_post= ?";
    sqlQuery = mysql.format(sqlQuery, [userId, postId]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
}

exports.modifyReaction = (reaction, userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "UPDATE reactions SET reaction= ? WHERE reactions.id_user= ? AND reactions.id_post= ?; ";
    sqlQuery = mysql.format(sqlQuery, [reaction, userId, postId]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Post liké !');
    });
  })
};

exports.createReaction = (reaction, userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "INSERT INTO likes (reaction, id_user, id_post) VALUES (?, ?, ?);";
    sqlQuery = mysql.format(sqlQuery, [reaction, userId, postId]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Post liké !');
    });
  })
};