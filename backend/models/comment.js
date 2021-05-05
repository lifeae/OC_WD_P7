const mysql = require('mysql');
const dbConnection = require('../dbConnection');

exports.getComments = (postId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "SELECT * FROM comments WHERE id_post= ?;";
    sqlQuery = mysql.format(sqlQuery, postId);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.getOneComment = (commentId) => {
  return new Promise((res, rej) => {
    let sqlQuery = "SELECT * FROM comments WHERE id= ?;";
    sqlQuery = mysql.format(sqlQuery, commentId);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.createComment = (userId, text, id_post) => {
  return new Promise((res, rej) => {
    let sqlQuery = "INSERT INTO comments (id_user, id_post, text, datetime) VALUES (?, ?, ?, CURRENT_TIMESTAMP);";
    sqlQuery = mysql.format(sqlQuery, [userId, id_post, text]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result);
    });
  })
};

exports.modifyComment = (text, idComment) => {
  return new Promise((res, rej) => {
    let sqlQuery = "UPDATE comments SET text= ? WHERE comments.id= ? ;";
    sqlQuery = mysql.format(sqlQuery, [text, idComment]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Comment modifié !');
    });
  })
};

exports.deleteComment = (idComment) => {
  return new Promise((res, rej) => {
    let sqlQuery = "DELETE FROM comments WHERE comments.id = ?;";
    sqlQuery = mysql.format(sqlQuery, idComment);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res('Comment supprimé !');
    });
  })
};