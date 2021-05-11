const mysql = require('mysql');
const dbConnection = require('../dbConnection');
const xss = require("xss");

exports.getAllComments = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users INNER JOIN comments ON comments.id_user = users.id WHERE id_post= ?;`;
    sqlQuery = mysql.format(xss(sqlQuery), xss(postId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.getOneComment = (commentId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM comments WHERE id= ?;`;
    sqlQuery = mysql.format(xss(sqlQuery), xss(commentId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.createComment = (userId, text, id_post) => {
  return new Promise((res, rej) => {
    let sqlQuery = `INSERT INTO comments (id_user, id_post, text, datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP);`;
    sqlQuery = mysql.format(sqlQuery, [xss(userId), xss(id_post), xss(text)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.modifyComment = (commentId, text) => {
  return new Promise((res, rej) => {
    let sqlQuery = `UPDATE comments SET text= ? WHERE comments.id= ? ;`;
    sqlQuery = mysql.format(sqlQuery, [xss(text), xss(commentId)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Comment modifié !');
    });
  })
};

exports.deleteComment = (idComment) => {
  return new Promise((res, rej) => {
    let sqlQuery = `DELETE FROM comments WHERE comments.id = ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(idComment));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Comment supprimé !');
    });
  })
};