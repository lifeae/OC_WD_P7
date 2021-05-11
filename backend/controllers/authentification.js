const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentificationMdl = require('../models/authentification');

exports.signup = (req, res, next) => {
  let emailRegex = `^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$`,
      passwordRegex = `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`;
      // Minimum eight characters, at least one letter in lowercase, one letter in uppercase, one number, one special character
  if (!req.body.email.match(emailRegex)) {
    res.status(400).json({ error: `Le champ email n'est pas correct !` });
  }
  if (!req.body.password.match(passwordRegex)) {
    res.status(400).json({ error: `Le mot de passe n'est pas suffisant ! Utilisez au minimum : 8 caractères, 1 lettre minuscule, 1 lettre majuscule, 1 chiffre, 1 caractères spécial.` });
  }
  if (req.body.email.match(emailRegex) && req.body.password.match(passwordRegex)) {
    authentificationMdl.isEmailIsAlreadyUsed(req.body.email)
      .then(result => {
        if (result) {
          res.status(400).json({ error: 'Cet email est déjà utilisé !' });
        } else {
          bcrypt.hash(req.body.password, 10)
            .then(hash => {
              authentificationMdl.signup(req.body.email, hash)
                .then(result => {
                  res.status(200).json({ message: 'Le compte a été crée !' });
                })
            })
        }
      })
      .catch(error => console.log(`ERREUR : Vous venez de sortir de la promesse de ${req.originalUrl} par le catch ! Vérifiez votre requête ! \n`))
  }
};

exports.login = (req, res, next) => {
  if (req.body.email === undefined) {
    return res.status(400).json({ error: `Aucun email n'a été evoyé à l'API.` });
  }
  authentificationMdl.login(req.body.email)
    .then(user => {
      if (user === undefined) {
        return res.status(400).json({ error: 'Cet email ne correspond à aucun compte.' });
      }
      bcrypt.compare(req.body.password, user.password, function (err, result) { // Comparaison du mot de passe saisie avec le hash enregistré en BDD
        if (err) throw err;
        if (result) {
          return res.status(200).json({ // On renvoie l'id de l'utilisateur et son jeton d'authentification
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