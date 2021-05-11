const mysql = require('mysql');
const dbConnection = require('../dbConnection');
const xss = require("xss");

exports.signup = (email, hash) => {
  return new Promise((res, rej) => {
    let sqlQuery = `INSERT INTO users (firstname, lastname, email, password, picture, position, phone, is_admin) VALUES ('', '', ?, ?, '', '', '', '0');`;
    sqlQuery = mysql.format(sqlQuery, [xss(email), xss(hash)]);
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (err) throw err;
      return res(result[0]);
    });
  })
};

exports.login = (email) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users WHERE email= ?;`;
    let test = mysql.format(sqlQuery, xss(email));
    dbConnection.query(test, function (err, result, fields) {
      if (err) rej(err);
      return res(result[0]);
    });
  })
}

exports.isEmailIsAlreadyUsed = (email) => {
  return new Promise((res, rej) => {
    let sqlQuery = `SELECT * FROM users WHERE email= ?;`;
    sqlQuery = mysql.format(sqlQuery, xss(email));
    dbConnection.query(sqlQuery, function (err, result, fields) {
      if (result === undefined) {
        if (DEBUG) console.log(`Aucun email n'a été reçu !`);
        return rej.send(err);
      } else if (result.length === 0) {
        if (DEBUG) console.log(`L'email n'existe pas en BDD !`);
        return res(false);
      } else {
        if (DEBUG) console.log(`L'email existe en BDD !`);
        return res(true);
      }
    });
  })
}