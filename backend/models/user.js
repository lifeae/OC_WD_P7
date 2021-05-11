const mysql = require('mysql');
const dbConnection = require('../dbConnection');
const xss = require("xss");

exports.getProfile = (profileId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users WHERE id= ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(profileId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res(result);
    });
  })
};

exports.modifyProfile = (firstname, lastname, email, picture, position, phone, id) => {
  return new Promise((res, rej) => {
    let sqlQuery = `UPDATE users SET firstname= ?, lastname= ?, email= ?, picture= ?, position= ?, phone= ? WHERE id= ?;`;
    sqlQuery = mysql.format(sqlQuery, [xss(firstname), xss(lastname), xss(email), xss(picture), xss(position), xss(phone), xss(id)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Profil modifié !');
    });
  })
};

exports.deleteProfile = (profileId) => {
  return new Promise((res, rej) => {
    let sqlQuery = `DELETE FROM users WHERE id= ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(profileId));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res('Compte supprimé !');
    });
  })
};

exports.isUserAdmin = (user) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users WHERE id= ? AND is_admin=1;`;
    sqlQuery = mysql.format(sqlQuery, xss(user));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      res(result);
    });
  })
};