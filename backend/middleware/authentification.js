const jwt = require('jsonwebtoken');
const userMdl = require('../models/user');
const DEBUG = require('../debug');


module.exports = (req, res, next) => {
  try {
    if (DEBUG) console.log(`Entrée dans le middleware d'authentification :`);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    req.userId = userId;
    console.log(req.userId)
    if (userId !== undefined) {
      req.userIsConnected = true;
    }
    // l'utilisateur est administrateur ?
    userMdl.isUserAdmin(req.userId)
      .then(result => {
        if (result.length === 0) {
          if (DEBUG) console.log(`L'utilisateur n'est pas administrateur.`);
          req.userIsAdmin = false;
        } else {
          if (DEBUG) console.log(`L'utilisateur est administrateur.`);
          req.userIsAdmin = true;
        }
        if (DEBUG) console.log(`Sortie du middleware d'authentification.`);
        return next();
      })
      .catch(error => res.status(401).json({ error: error }))
  } catch {
    res.status(401).json({ error: new Error })
  }
};