function redirectToHomePage() {
  if (DEBUG) console.log("Redirection vers la page d'accueil.");
  let homePageLocation = `frontend/html/home.html`,
    urlToHomePage = `${window.location.origin}/${homePageLocation}`;
  window.location.replace(urlToHomePage);
}

function getTheApiRequest(body, method) {
  // Préparation des paramètres de la requête
  let headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
  };

  // Assemblage de la requête
  let request = {
    method: method,
    headers: headers
  }

  // Ajout du body s'il y en a un
  if (body !== null) {
    request = {
      ...request,
      body: JSON.stringify(body)
    };
  }
  return request
}

function getUrlParameters(parameter) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (DEBUG) console.log(`Récupération du paramètre ${parameter} dans l'url.`, `\n`, `${parameter} = ${urlParams.get(parameter)}`);
  return urlParams.get(parameter);
}

function getCleanDisplayForDateTime(datetime) {
  let date = datetime.split('T')[0],
    year = date.split('-')[0],
    month = date.split('-')[1],
    day = date.split('-')[2],
    time = datetime.split('T')[1].slice(0, 5);

  switch (month) {
    case '01':
      month = 'Janvier';
      break;
    case '02':
      month = 'Février';
      break;
    case '03':
      month = 'Mars';
      break;
    case '04':
      month = 'Avril';
      break;
    case '05':
      month = 'Mai';
      break;
    case '06':
      month = 'Juin';
      break;
    case '07':
      month = 'Juillet';
      break;
    case '08':
      month = 'Août';
      break;
    case '09':
      month = 'Septembre';
      break;
    case '10':
      month = 'Octobre';
      break;
    case '11':
      month = 'Novembre';
      break;
    case '12':
      month = 'Décembre';
      break;
    default:
      break;
  };

  datetime = `Le ${day} ${month} ${year} à ${time}`;
  return datetime;
}

function createPost() {
  let text = document.querySelector("#new-post");
  let body = {
    text: text.value
  };
  text.value = "";
  request = getTheApiRequest(body, 'POST');
  fetch('http://localhost:3000/posts', request)
    .then(result => result.json())
    .then(data => data.result)
    .then(result => {
      if (DEBUG) console.groupCollapsed(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post crée !`);
      if (DEBUG) console.log(`Champ de saisie vidé !`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyPost() {
  if (DEBUG) console.log("modifyPost()");
}

function deletePost() {
  if (DEBUG) console.log("deletePost()");
}

function getAllPosts() {
  let request = getTheApiRequest(null, 'GET');
  fetch('http://localhost:3000/posts', request)
    .then(result => result.json())
    .then(data => data.result)
    .then(posts => {
      if (DEBUG) console.log(`Récupération de tous les posts`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      posts.forEach(post => {
        displayOnePost(post);
        displayCommentsForOnePost(post.id);
      });
    })
}

function getOnePost() {
  let urlParameterPostId = getUrlParameters('id');
  let request = getTheApiRequest(null, 'GET');
  fetch(`http://localhost:3000/posts/${urlParameterPostId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(post => {
      if (DEBUG) console.groupCollapsed(`Récupération du post : ${urlParameterPostId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      displayOnePost(post);
      displayCommentsForOnePost(urlParameterPostId);
      console.groupEnd();
    })
}

function displayOnePost(post) {
  console.groupCollapsed(`Post n°${post.id}`);
  console.log(post);
  console.groupEnd();
  let postContainer = document.createElement('div');
  let postEmplacement = document.querySelector("#posts-container");
  postEmplacement.appendChild(postContainer);
  postContainer.dataset.user = post.id_user;
  postContainer.dataset.id = post.id;
  postContainer.classList.add("post");

  displayUserInformationsToThePost(post.id_user, postContainer)
  displayTextToThePost(post, postContainer);
  displayDateTimeToThePost(post, postContainer);
  getInputToCreateComment(post.id);

  if (checkIfUserIsTheOwner(post)) {
    displayModifyButton("post", postContainer);
    displayDeleteButton("post", postContainer);
  }


  // Si cette fonction a été appelée depuis le fil d'actualités
  if (window.location.pathname.split('/')[3] === 'home.html') {
    displayLinkToThePost(post, postContainer);
  };
}

function displayTextToThePost(post, postContainer) {
  let text = document.createElement('p');
  postContainer.appendChild(text);
  text.innerHTML = post.text;
  text.classList.add("post-text");
}

function displayDateTimeToThePost(post, postContainer) {
  let datetime = document.createElement('p');
  postContainer.appendChild(datetime);
  datetime.innerHTML = getCleanDisplayForDateTime(post.datetime);
  datetime.classList.add("post-datetime");
}

function getUserInformations(userId) {
  return new Promise((res, rej) => {
    let request = getTheApiRequest(null, 'GET');

    fetch(`http://localhost:3000/user/profile/${userId}`, request)
      .then(result => result.json())
      .then(data => data.result[0])
      .then(userProfile => {
        if (DEBUG) console.groupCollapsed(`Récupération du profil n°${userId}`);
        if (DEBUG) console.log(`Requête envoyée :`, request);
        if (DEBUG) console.log("Profil récupéré : ", userProfile);
        if (DEBUG) console.groupEnd();
        return res(userProfile);
      });
  })
}

function displayUserInformationsToThePost(userId, postContainer) {
  getUserInformations(userId)
    .then(userProfile => {
      let ownerInformationsContainer = document.createElement('a'),
        name = document.createElement('p');
      postContainer.appendChild(ownerInformationsContainer);
      ownerInformationsContainer.appendChild(name);
      name.innerHTML = `${userProfile.firstname} ${userProfile.lastname}`;
      ownerInformationsContainer.classList.add("owner-informations");

      // Créer un lien vers le profil de l'auteur
      let profilePageLocation = `frontend/html/profile.html`,
        urlToUserProfilePage = `${window.location.origin}/${profilePageLocation}?id=${userId}`;
      ownerInformationsContainer.href = urlToUserProfilePage;
    })
}

function displayLinkToThePost(post, postContainer) {
  let postLink = document.createElement('a');
  postContainer.appendChild(postLink);
  postLink.innerHTML = "Afficher ce post uniquement";
  let homePageLocation = `frontend/html/post.html`,
    urlToPostPage = `${window.location.origin}/${homePageLocation}?id=${post.id}`;
  postLink.setAttribute("href", urlToPostPage);
  postLink.classList.add("post-linkto");
}

function displayCommentsForOnePost(postId) {
  let request = getTheApiRequest(null, 'GET');
  fetch(`http://localhost:3000/comments/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(comments => {
      if (DEBUG) console.groupCollapsed(`Commentaires du post n°${postId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) {
        if (comments.length === 0) console.log("Ce post ne possède pas de commentaires.");
      }
      comments.forEach(comment => {
        if (DEBUG) console.log("Commentaire récupéré : ", comment);
        displayOneComment(comment, postId);
      });
      if (DEBUG) console.groupEnd();
    })
}

function displayOneComment(comment, postId) {
  // Création des éléments html du commentaire
  let commentContainer = document.createElement('div');
  let datetime = document.createElement('p');
  let text = document.createElement('p');

  // Organisation des éléments
  let commentsLocation = document.querySelector(`[data-id='${postId}']`);
  commentsLocation.appendChild(commentContainer);
  commentContainer.appendChild(datetime);
  commentContainer.appendChild(text);

  // Remplissage des éléments
  text.innerHTML = comment.text;
  datetime.innerHTML = getCleanDisplayForDateTime(comment.datetime);

  //Stylisation des éléments
  commentContainer.classList.add("comment");
  datetime.classList.add("comment-datetime");
  text.classList.add("comment-text");
  commentContainer.dataset.user = comment.id_user;
  commentContainer.dataset.id = comment.id;
  if (checkIfUserIsTheOwner(comment)) {
    displayModifyButton("comment",commentContainer);
    displayDeleteButton("comment",commentContainer);
  }
}

function getInputToCreateComment(postId) {
  let input = document.createElement("input"),
    commentsLocation = document.querySelector(`[data-id='${postId}']`),
    validateButton = document.createElement("button");
  commentsLocation.appendChild(input);
  commentsLocation.appendChild(validateButton);
  validateButton.innerHTML = "Envoyer";
  input.classList.add("new-comment-input");
  validateButton.classList.add("new-comment-submit");
  input.setAttribute("placeholder", "Ecrivez un commentaire ...");
  validateButton.addEventListener("click", createComment);
}

function createComment() {
  let postId = this.parentElement.dataset.id;
  let input = this.previousSibling;
  let body = {
    text: input.value,
    id_post: postId
  };
  let request = getTheApiRequest(body, 'POST');

  fetch(`http://localhost:3000/comments`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.groupCollapsed(`Création d'un nouveau commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log("Commentaire crée !", comment);
      if (DEBUG) console.log("Réactualisation de la page.");
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyComment() {
  let commentId = this.parentElement.dataset.id;
  let oldComment = this.previousSibling.textContent;
  let newComment = prompt("Modifier le commentaire", oldComment);
  let body = {
    text: newComment,
    comment_id: commentId
  };
  let request = getTheApiRequest(body, 'PUT');

  fetch(`http://localhost:3000/comments/${commentId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.groupCollapsed(`Modification d'un commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log("Commentaire crée !", comment);
      if (DEBUG) console.log("Réactualisation de la page.");
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function deleteComment() {
  let commentId = this.parentElement.dataset.id;
  let request = getTheApiRequest(null, 'DELETE');

  fetch(`http://localhost:3000/comments/${commentId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.groupCollapsed(`Suppression d'un commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log("Commentaire crée !", comment);
      if (DEBUG) console.log("Réactualisation de la page.");
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function displayModifyButton(elementType, elementContainer) {
  let button = document.createElement("button");
  button.innerHTML = "Modifier";
  if (elementType === "post") {
    button.addEventListener("click", modifyPost);
  } else if (elementType === "comment") {
    button.addEventListener("click", modifyComment);
  }
  elementContainer.appendChild(button);
}

function displayDeleteButton(elementType, elementContainer) {
  let button = document.createElement("button");
  button.innerHTML = "Supprimer";
  if (elementType === "post") {
    button.addEventListener("click", deletePost);
  } else if (elementType === "comment") {
    button.addEventListener("click", deleteComment);
  }
  elementContainer.appendChild(button);
}

function checkIfUserIsTheOwner(element) {
  if (element.id_user == sessionStorage.getItem('userId')) {
    return true;
  } else {
    return false;
  }
}

/**
 * Check le sessionStorage pour vérifier la présence ou l'absence du jeton d'authentification
 */

function isUserConnected() {
  if (sessionStorage.getItem('token') !== null) {
    return true;
  } else {
    return false;
  }
}

/**
 * L'utilisateur est connecté
 *  → Afficher le fil d'actualités
 * L'utilisateur n'est pas connecté
 *  → Afficher les possibilités d'authentification
 */

function whatToDisplayDependingOnTheUserLoginStatus() {
  if (isUserConnected()) {
    if (DEBUG) console.log("L'utisateur est connecté.", "\n", "Boutons d'authentification cachés.");
    document.querySelector(".user-is-disconnected").style.display = "none";
  } else {
    if (DEBUG) console.log("L'utisateur n'est pas connecté.", "\n", "Fil d'actualités caché.");
    document.querySelector(".user-is-connected").style.display = "none";
  }
}

/**
 * Supprime le jeton d'authentification et l'identifiant de l'utilisateur dans le sessionStorage
 */
function logOut() {
  if (DEBUG) console.groupCollapsed("L'utisateur se déconnecte.");
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userId');
  if (DEBUG) console.log("Token d'authentification et identifiant de l'utilisateur supprimés.");
  redirectToHomePage()
  if (DEBUG) console.groupEnd();
}

function goToUserProfile() {
  let profilePageLocation = `frontend/html/profile.html`,
    urlToUserProfilePage = `${window.location.origin}/${profilePageLocation}?id=${userId}`;
  window.location.replace(urlToUserProfilePage);
}

let userId = sessionStorage.getItem('userId');
let userLocation = window.location.pathname.split('/')[3];
if (!isUserConnected()) {
  if ((userLocation === 'profile.html') || (userLocation === 'post.html')) {
    if (DEBUG) console.log("L'utilisateur n'est pas connecté", "Il ne peut pas accéder à cette page.");
    redirectToHomePage();
  }
}