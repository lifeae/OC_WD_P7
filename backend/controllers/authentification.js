const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const authentificationMdl = require('../models/authentification');

exports.signup = (req, res, next) => {
  authentificationMdl.isEmailIsAlreadyUsed(req.body.email)
  .then(result => {
    if (result) {
      res.status(400).json({ error: 'Cet email est déjà utilisé !' });
    } else {
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        authentificationMdl.signup(req.body.email, hash)
        .then(result => {
          res.status(200).json({ message: 'Le compte a été crée !'});
        })
      })
    }
  })
  .catch(error => console.log(`ERREUR : Vous venez de sortir de la promesse de ${req.originalUrl} par le catch ! Vérifiez votre requête ! \n`))
};

exports.login = (req, res, next) => {
  authentificationMdl.login(req.body.email)
  .then(user => {
    if (user === undefined) {
      return res.status(400).json({ error: 'Cet email ne correspond à aucun compte.' });
    }
    bcrypt.compare(req.body.password, user.password, function(err, result) { // Comparaison du mot de passe saisie avec le hash enregistré en BDD
      if (err) throw err;
      if (result) {
        return res.status(200).json({ // On renvoie l'id de l'utilisateur et son jeton
          userId: user.id,
          token: jwt.sign(
            { userId: user.id },
            process.env.TOKEN,
            { expiresIn: '24h' }
          )
        })
      } else { // Les mots de passes ne correspondent pas
        return res.status(400).json({ error: 'Ce compte existe mais le mot de passe saisi est incorrect.' });
      }
    })
  })
  .catch((err) => res.status(400).json({ error: err }));
}