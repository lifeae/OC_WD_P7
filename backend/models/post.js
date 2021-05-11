const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnection = require('../dbConnection');
const xss = require("xss");

exports.getAllPosts = () => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users INNER JOIN posts ON posts.id_user = users.id ORDER BY posts.datetime DESC;`;
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    })
  })
};

exports.createPost = (userId, text) => {
  return new Promise((res, rej) => {
    let sqlQuery = `INSERT INTO posts (id_user, text, datetime) VALUES (?, ?, CURRENT_TIMESTAMP);`;
    sqlQuery = mysql.format(sqlQuery, [xss(userId), xss(text)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.getOnePost = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users INNER JOIN posts ON posts.id_user = users.id WHERE posts.id= ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(postId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.modifyPost = (text, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `UPDATE posts SET text= ? WHERE posts.id= ? ;`;
    sqlQuery = mysql.format(sqlQuery, [xss(text), xss(postId)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Post modifié !');
    });
  })
};

exports.deletePost = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `DELETE FROM posts WHERE posts.id = ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(postId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Post supprimé !');
    });
  })
};

exports.isUserAlreadyReacted = (userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM likes WHERE id_user= ? id_post= ?`;
    sqlQuery = mysql.format(sqlQuery, [xss(userId), xss(postId)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
}

exports.modifyReaction = (reaction, userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `UPDATE reactions SET reaction= ? WHERE reactions.id_user= ? AND reactions.id_post= ?;`;
    sqlQuery = mysql.format(sqlQuery, [xss(reaction), xss(userId), xss(postId)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Post liké !');
    });
  })
};

exports.createReaction = (reaction, userId, postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `INSERT INTO likes (reaction, id_user, id_post) VALUES (?, ?, ?);`;
    sqlQuery = mysql.format(sqlQuery, [xss(reaction), xss(userId), xss(postId)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Post liké !');
    });
  })
};