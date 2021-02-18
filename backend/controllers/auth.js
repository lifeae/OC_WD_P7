const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnection = require("../dbConnection");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      let sqlQuery = "INSERT INTO users (firstname, lastname, email, password, picture, position, phone, is_admin) VALUES ('', '', ?, ?, '', '', '', '0');";
      let parameters = [req.body.email, hash];
      sqlQuery = mysql.format(sqlQuery, parameters);
      dbConnection.query(sqlQuery, function (err, result, fields) {
        if (err) throw err;
        res.send('Utilisateur créé !');
      });
    })
};

exports.login = (req, res, next) => {
  let sqlQuery = "SELECT * FROM users WHERE email= ?;";
  let parameters = [req.body.email];
  sqlQuery = mysql.format(sqlQuery, parameters); // Ce mail est-il attribué a un utilisateur ?
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    if (result) {      
      // Un utilisateur possède cet email
      let user = result[0];
      bcrypt.compare(req.body.password, user.password, function(err, result) { // Comparaison du mot de passe saisie avec le hash enregistré en BDD
        if (err) throw err;
        if (result) { // Les mots de passes correspondent
          res.json({ // On renvoie l'id de l'utilisateur et son jeton
            userId: user.id,
            token: jwt.sign(
              { userId: user.id },
              process.env.TOKEN,
              { expiresIn: '6h' }
            )
          })
        } else { // Les mots de passes ne correspondent pas
          return res.json({success: false, message: 'passwords do not match'});
        }
      });
    }
  })
}