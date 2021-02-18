const fs = require('fs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnection = require("../dbConnection");

exports.getAllPosts = (req, res, next) => {
  let sqlQuery = "SELECT * FROM posts ;";
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

exports.createPost = (req, res, next) => {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(' ');
  const decoded = jwt.verify(token[1], process.env.TOKEN);
  let sqlQuery = "INSERT INTO posts (id_user, text, datetime) VALUES (?, ?, CURRENT_TIMESTAMP);";
  let parameters = [decoded.userId, req.body.text];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

exports.getOnePost = (req, res, next) => {
  let sqlQuery = "SELECT * FROM posts WHERE id= ?;";
  let parameters = [req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
};

exports.modifyPost = (req, res, next) => {
  let sqlQuery = "UPDATE posts SET text= ? WHERE posts.id= ? ;";
  let parameters = [req.body.text, req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Post modifié !");
  });
};

exports.deletePost = (req, res, next) => {
  let sqlQuery = "DELETE FROM posts WHERE posts.id = ?;";
  let parameters = [req.params.id];
  sqlQuery = mysql.format(sqlQuery, parameters);
  dbConnection.query(sqlQuery, function (err, result, fields) {
    if (err) throw err;
    res.send("Post supprimé !");
  });
};

exports.likePost = (req, res, next) => {
  let sqlQueryToFindRecord = "SELECT * FROM posts WHERE id= ?;";
  let parameters = [req.params.id];
  sqlQueryToFindRecord = mysql.format(sqlQueryToFindRecord, parameters);
  dbConnection.query(sqlQueryToFindRecord, function (err, result, fields) {
    if (err) throw err;
    let statusMessage,
    indexOfUserInUserLiked = result.users_liked.indexOf(result.id_user), //mettre l'identifiant de l'utilisateur connecté entre les parenthèses
    indexOfUserInUserDisliked = post.usersDisliked.indexOf(result.id_user); //idem
    // Est-ce que l'user a déjà voté ?
    if (indexOfUserInUserLiked !== -1) { // L'user a déjà dit qu'il aimait ce post
    // On efface son ancien vote
    post.likes--;
    post.usersLiked.splice(indexOfUserInUserLiked, 1);
    }
    if (indexOfUserInUserDisliked !== -1) { // L'user a déjà dit qu'il n'aimait pas ce post
    // On efface son ancien vote
    post.dislikes--;
    post.usersDisliked.splice(indexOfUserInUserDisliked, 1);
    }

    // On met en place son nouveau vote
    switch (req.body.like) {
    case 1:
      post.likes++;
      post.usersLiked.push(req.body.userId);
      statusMessage = "Post likée !";
      break;
    case 0:
      statusMessage = "Post ignorée !";
      break;
    case -1:
      post.dislikes++;
      post.usersDisliked.push(req.body.userId);
      statusMessage = "Post dislikée !";     
      break;
    }
  });


  let sqlQueryToUpdateRecord = "UPDATE posts SET text= ? WHERE posts.id= ?;";
  parameters = [req.body.text, req.params.id];
  sqlQueryToUpdateRecord = mysql.format(sqlQueryToUpdateRecord, parameters);
  dbConnection.query(sqlQueryToUpdateRecord, function (err, result, fields) {
    if (err) throw err;
    res.send("Post modifié !");
  });
};