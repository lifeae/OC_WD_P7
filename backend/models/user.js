const mysql = require('mysql');
const dbConnection = require("../dbConnection");

exports.getProfile = (req, res, next) => {
  let sqlQuery = "SELECT * FROM users WHERE id= ?;";
  let parameters = [req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

exports.modifyProfile = (req, res, next) => {
  let sqlQuery = "UPDATE users SET firstname= ?, lastname= ?, email= ?, picture= ?, position= ?, phone= ? WHERE id= ?;";
  let parameters = [req.body.firstname, req.body.lastname, req.body.email, req.body.picture, req.body.position, req.body.phone, req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Profil modifié !");
  });
};

exports.deleteProfile = (req, res, next) => {
  let sqlQuery = "DELETE FROM users WHERE id= ?;";
  let parameters = [req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Compte supprimé !");
  });
};