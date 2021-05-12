const commentMdl = require('../models/comment');
const postMdl = require('../models/post');
const DEBUG = require('../debug');

module.exports = (req, res, next) => {
  if (DEBUG) console.log(`Entrée dans le middleware d'autorisation :`);
  // l'utilisateur est admin ? ...
  if (req.userIsAdmin) {
    if (DEBUG) console.log(`L'utilisateur est administrateur.`);
    if (DEBUG) console.log(`Sortie du middleware d'autorisation.`);
    return next();
  }
  if (DEBUG) console.log(`L'utilisateur n'est pas administrateur.`)
  // l'utilisateur est propriétaire ? ...
  let routeUsed = req.originalUrl.split('/')[1];
  switch (routeUsed) {
    case 'user': // du profil qu'il souhaite modifier ?
      if (req.params.id != req.userId) {
        req.userIsOwner = false;
        if (DEBUG) console.log(`L'utilisateur n'est pas propriétaire de ce profil. Il ne peut pas le modifier.`);
      } else {
        req.userIsOwner = true;
        if (DEBUG) console.log(`L'utilisateur est propriétaire de ce profil. Il peut le modifier.`);
        if (DEBUG) console.log(`Sortie du middleware d'autorisation.`);
        return next();
      }
      break;
    case 'posts': // du post qu'il souhaite modifier ?
      postMdl.getOnePost(req.params.id)
        .then(result => {
          if (result[0].id_user != req.userId) {
            req.userIsOwner = false;
            if (DEBUG) console.log(`L'utilisateur n'est pas propriétaire de ce post. Il ne peut pas le modifier.`);
          } else {
            req.userIsOwner = true;
            if (DEBUG) console.log(`L'utilisateur est propriétaire de ce post. Il peut le modifier.`);
            if (DEBUG) console.log(`Sortie du middleware d'autorisation.`);
            return next();
          }
        })
      break;
    case 'comments': // du commentaire qu'il souhaite modifier ?
      commentMdl.getOneComment(req.params.id)
        .then(result => {
          if (result[0].id_user != req.userId) {
            req.userIsOwner = false;
            if (DEBUG) console.log(`L'utilisateur n'est pas propriétaire de ce commentaire. Il ne peut pas le modifier.`);
          } else {
            req.userIsOwner = true;
            if (DEBUG) console.log(`L'utilisateur est propriétaire de ce commentaire. Il peut le modifier.`);
            if (DEBUG) console.log(`Sortie du middleware d'autorisation.`);
            return next();
          }
        })
      break;
    default:
      if (DEBUG) console.log(`Oups, quelque chose ne s'est pas passé comme prévu !`);
      break;
  }
};