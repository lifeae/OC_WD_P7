const commentMdl = require('../models/comment');
const postMdl = require('../models/post');
const userMdl = require('../models/user');

module.exports = (req, res, next) => {

  let isUserAuthorize = false;

  // l'utilisateur est administrateur ?
  userMdl.isUserAdmin(req.user)
  .then(result => {
    if (result.length === 0) {
      console.log(`Vous n'êtes pas administrateur.`);
    } else {
      isUserAuthorize = true;
      console.log(`Vous êtes administrateur.`);
    }
  })
  .then(result => {
    if (isUserAuthorize) {
      next();
    }
  });

  // l'utilisateur est propriétaire ...
  let routeUsed = req.originalUrl.split('/')[1];
  switch (routeUsed) {
    case 'user': // du profil qu'il souhaite modifier ?
        if (req.params.id != req.user) {
          return console.log(`Vous n'êtes pas propriétaire de ce profil. Vous ne pouvez pas le modifier.`);
        } else {
          isUserAuthorize = true;
          console.log(`Vous êtes propriétaire de ce profil. Vous pouvez le modifier.`);
        }
        if (isUserAuthorize) {
          next();
        }
      break;
    case 'posts': // du post qu'il souhaite modifier ?
      postMdl.getOnePost(req.params.id)
      .then(result => {
        if (result[0].id_user != req.user) {
          return console.log(`Vous n'êtes pas propriétaire de ce post. Vous ne pouvez pas le modifier.`);
        } else {
          isUserAuthorize = true;
          console.log(`Vous êtes propriétaire de ce post. Vous pouvez le modifier.`);
        }
      })
      .then(result => {
        if (isUserAuthorize) {
          next();
        }
      });
      break;
    case 'comments': // du commentaire qu'il souhaite modifier ?
      commentMdl.getOneComment(req.params.id)
      .then(result => {
        if (result[0].id_user != req.user) {
          return console.log(`Vous n'êtes pas propriétaire de ce commentaire. Vous ne pouvez pas le modifier.`);
        } else {
          isUserAuthorize = true;
          console.log(`Vous êtes propriétaire de ce commentaire. Vous pouvez le modifier.`);
        }
      })
      .then(result => {
        if (isUserAuthorize) {
          next();
        }
      });
      break;
    default:
      console.log(`Oups, quelque chose ne s'est pas passé comme prévu !`);
      break;
  }
};