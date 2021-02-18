const fs = require('fs');
const mysql = require('mysql');
const dbConnection = require("../dbConnection");

exports.createComment = (req, res, next) => {
  let sqlQuery = "INSERT INTO comments (id_user, text, datetime) VALUES (?, ?, CURRENT_TIMESTAMP);";
  let parameters = ["1", req.body.text]; // MODIFIER CE 1 par l'id de l'utilisateur connecté
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

exports.modifyComment = (req, res, next) => {
  let sqlQuery = "UPDATE comments SET text= ? WHERE comments.id= ? ;";
  let parameters = [req.body.text, req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Comment modifié !");
  });
};

exports.deleteComment = (req, res, next) => {
  let sqlQuery = "DELETE FROM comments WHERE comments.id = ?;";
  let parameters = [req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Comment supprimé !");
  });
};