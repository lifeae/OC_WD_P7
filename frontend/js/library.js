function redirectToHomePage() {
  if (DEBUG) console.log(`Redirection vers la page d'accueil.`);
  let homePageLocation = `frontend/html/home.html`,
    urlToHomePage;
  if (window.location.origin !== "null") {
    urlToHomePage = `${window.location.origin}/${homePageLocation}`
  } else {
    urlToHomePage = `${window.location.href.split("/frontend/html")[0]}/${homePageLocation}`;
  }
  window.location.replace(urlToHomePage);
}

function getTheApiRequest(body, method, contentType) {
  // Préparation des paramètres de la requête
  let headers = {
    "Accept": "application/json, text/plain, multipart/form-data, */*",
    "Content-Type": contentType,
    "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
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
  return request;
}

function getUrlParameters(parameter) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (DEBUG) console.log(`Récupération du paramètre ${parameter} dans l'url.`, `\n`, `${parameter} = ${urlParams.get(parameter)}`);
  return urlParams.get(parameter);
}

function createPost() {
  let text = document.querySelector("#new-post"),
    body = {
      text: text.value
    };

  text.value = ``;
  request = getTheApiRequest(body, "POST", "application/json");
  fetch("http://localhost:3000/posts", request)
    .then(result => result.json())
    .then(data => data.result)
    .then(result => {
      if (DEBUG) console.group(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post crée !`);
      if (DEBUG) console.log(`Champ de saisie vidé !`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyPost() {
  let postId = this.closest("*[data-id]").dataset.id,
    oldPost = document.querySelector(`*[data-id="${postId}"] .post-text`).textContent,
    newPost = prompt(`Modifier le post`, oldPost),
    body = {
      text: newPost,
      post_id: postId
    },
    request = getTheApiRequest(body, "PUT", "application/json");

  fetch(`http://localhost:3000/posts/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.group(`Modification d'un post.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post modifié !`);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function deletePost() {
  let postId = this.closest("*[data-id]").dataset.id;
  let request = getTheApiRequest(null, "DELETE", "application/json");

  fetch(`http://localhost:3000/posts/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(post => {
      if (DEBUG) console.log(post);
      if (DEBUG) console.group(`Suppression d'un post.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post supprimé !`);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function getAllPosts() {
  let request = getTheApiRequest(null, "GET");
  fetch("http://localhost:3000/posts", request)
    .then(result => {
      return result.json();
    })
    .then(data => {
      userIsAdmin = data.userIsAdmin;
      userIsConnected = data.userIsConnected;
      userId = data.userId;
      whatToDisplayDependingOnTheUserLoginStatus(userIsConnected);
      addLinkToUserConnectedProfile(userId);
      return data.result;
    })
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
  let urlParameterPostId = getUrlParameters("id");
  let request = getTheApiRequest(null, "GET", "application/json");
  fetch(`http://localhost:3000/posts/${urlParameterPostId}`, request)
    .then(result => result.json())
    .then(data => {
      if (DEBUG) console.log(data);
      canTheUserAccessThisPage(data.userIsConnected);
      return data.result[0];
    })
    .then(post => {
      if (DEBUG) console.group(`Récupération du post : ${urlParameterPostId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      displayOnePost(post);
      displayCommentsForOnePost(urlParameterPostId);
      console.groupEnd();
    })
}

function displayOnePost(post) {

  if (DEBUG) console.group(`Post n°${post.id}`);
  if (DEBUG) console.log(post);
  if (DEBUG) console.groupEnd();

  let postsContainer = document.querySelector("#posts-container"),
    postContainer = document.createElement("div"),
    postInformations = document.createElement("div"),
    ownerInformationsContainer = document.createElement("a"),
    buttonsContainer = document.createElement("div"),
    commentsContainer = document.createElement("div"),
    commentsContainerTitle = document.createElement("h2"),
    createCommentContainer = document.createElement("div");

  postContainer.dataset.user = post.id_user;
  postContainer.dataset.id = post.id;
  postContainer.classList.add("post");
  buttonsContainer.classList.add("buttons-container");
  commentsContainer.classList.add("comments-container");
  postInformations.classList.add("post-informations");
  commentsContainerTitle.textContent = "Commentaires";

  postsContainer.appendChild(postContainer);
  postContainer.appendChild(postInformations);

  postInformations.appendChild(ownerInformationsContainer);
  displayUserInformationsToTheElement(post, ownerInformationsContainer)
  displayDateTimeToTheElement(post, "post", postInformations);
  displayTextToTheElement(post, "post", postContainer);

  if (userLocation === "home.html") {
    displayLinkToThePost(post, buttonsContainer);
  };

  if (userId === post.id_user || userIsAdmin) {
    displayModifyButton("post", buttonsContainer);
    displayDeleteButton("post", buttonsContainer);
  }

  postContainer.appendChild(buttonsContainer);
  postContainer.appendChild(commentsContainer);
  commentsContainer.appendChild(commentsContainerTitle);
  postContainer.appendChild(createCommentContainer);
  getStuffToCreateComment(createCommentContainer);
}

function displayTextToTheElement(element, elementType, elementContainer) {
  let text = document.createElement("p");
  elementContainer.appendChild(text);
  text.innerHTML = element.text;
  if (elementType === "post") {
    text.classList.add("post-text");
  } else if (elementType === "comment") {
    text.classList.add("comment-text");
  }
}

function displayDateTimeToTheElement(element, elementType, elementContainer) {
  let datetime = document.createElement("p");
  elementContainer.appendChild(datetime);
  datetime.innerHTML = `le ${(new Date(element.datetime)).toLocaleDateString("fr-FR", { hour: "numeric", minute: "numeric" })}`;
  if (elementType === "post") {
    datetime.classList.add("post-datetime");
  } else if (elementType === "comment") {
    datetime.classList.add("comment-datetime");
  }
}

function displayUserInformationsToTheElement(element, targetElement) {
  // Créer un lien vers le profil de l'auteur
  let profilePageLocation = `frontend/html/profile.html`,
    urlToUserProfilePage;

  if (window.location.origin !== "null") {
    urlToUserProfilePage = `${window.location.origin}/${profilePageLocation}?id=${element.id_user}`;
  } else {
    urlToUserProfilePage = `${window.location.href.split("/frontend/html")[0]}/${profilePageLocation}?id=${element.id_user}`;
  }

  targetElement.classList.add("owner-informations");
  targetElement.innerHTML = `${element.firstname} ${element.lastname}`;
  targetElement.href = urlToUserProfilePage;
}

function displayLinkToThePost(post, targetElement) {
  let postLink = document.createElement("a");
  let postLinkContent = document.createElement("button");
  targetElement.appendChild(postLink);
  postLink.appendChild(postLinkContent);
  postLinkContent.innerHTML = '<i class="fas fa-external-link-alt"></i> Afficher ce post uniquement';

  let postPageLocation = `frontend/html/post.html`,
    urlToPostPage;
  if (window.location.origin !== "null") {
    urlToPostPage = `${window.location.origin}/${postPageLocation}?id=${post.id}`;
  } else {
    urlToPostPage = `${window.location.href.split("/frontend/html")[0]}/${postPageLocation}?id=${post.id}`;
  }
  postLink.setAttribute("href", urlToPostPage);
  postLink.classList.add("post-linkto");
}

function displayCommentsForOnePost(postId) {
  let request = getTheApiRequest(null, "GET", "application/json");
  fetch(`http://localhost:3000/comments/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(comments => {
      if (DEBUG) console.group(`Commentaires du post n°${postId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) {
        if (comments.length === 0) if (DEBUG) console.log(`Ce post ne possède pas de commentaires.`);
      }
      comments.forEach(comment => {
        if (DEBUG) console.log(`Commentaire récupéré : `, comment);
        displayOneComment(comment, postId);
      });
      if (DEBUG) console.groupEnd();
    })
}

function displayOneComment(comment) {

  let commentContainer = document.createElement("div"),
    commentInformations = document.createElement("div"),
    ownerInformationsContainer = document.createElement("a"),
    buttonsContainer = document.createElement("div"),
    targetElement = document.querySelector(`[data-id="${comment.id_post}"] .comments-container`);


  commentContainer.dataset.user = comment.id_user;
  commentContainer.dataset.id = comment.id;
  commentContainer.classList.add("comment");
  buttonsContainer.classList.add("buttons-container");
  commentInformations.classList.add("comment-informations");



  targetElement.appendChild(commentContainer);
  commentContainer.appendChild(commentInformations);
  commentInformations.appendChild(ownerInformationsContainer);
  commentContainer.appendChild(buttonsContainer);

  displayUserInformationsToTheElement(comment, ownerInformationsContainer);
  displayDateTimeToTheElement(comment, "comment", commentInformations);
  displayTextToTheElement(comment, "comment", commentContainer);

  if (userId === comment.id_user || userIsAdmin) {
    displayModifyButton("comment", buttonsContainer);
    displayDeleteButton("comment", buttonsContainer);
  }
}

function getStuffToCreateComment(targetElement) {
  let textarea = document.createElement("textarea");

  textarea.setAttribute("placeholder", "Ecrivez un commentaire ...");
  textarea.classList.add("new-comment-textarea");
  validateButton = document.createElement("button");
  validateButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
  validateButton.classList.add("new-comment-submit");
  validateButton.addEventListener("click", createComment);

  targetElement.classList.add("new-comment-container");
  targetElement.appendChild(textarea);
  targetElement.appendChild(validateButton);
}

function createComment() {
  let postId = this.closest("*[data-id]").dataset.id;
  let textarea = document.querySelector(`*[data-id="${postId}"] .new-comment-textarea`);
  let body = {
    text: textarea.value,
    id_post: postId
  };
  let request = getTheApiRequest(body, "POST", "application/json");

  fetch(`http://localhost:3000/comments`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.group(`Création d'un nouveau commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Commentaire crée !`, comment);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyComment() {
  let commentId = this.closest("*[data-id]").dataset.id,
    oldComment = document.querySelector(`*[data-id="${commentId}"] .comment-text`).textContent,
    newComment = prompt("Modifier le commentaire", oldComment);
  let body = {
    text: newComment
  };
  let request = getTheApiRequest(body, "PUT", "application/json");

  fetch(`http://localhost:3000/comments/${commentId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.group(`Modification d'un commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Commentaire crée !`, comment);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function deleteComment() {
  let commentId = this.closest("*[data-id]").dataset.id,
    request = getTheApiRequest(null, "DELETE", "application/json");

  fetch(`http://localhost:3000/comments/${commentId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.log(comment);
      if (DEBUG) console.group(`Suppression d'un commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Commentaire crée !`, comment);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function displayModifyButton(elementType, targetElement) {
  let button = document.createElement("button");
  button.innerHTML = '<i class="fas fa-edit"></i></i> Modifier';
  if (elementType === "post") {
    button.addEventListener("click", modifyPost);
    button.classList.add("modify-post");
  } else if (elementType === "comment") {
    button.addEventListener("click", modifyComment);
    button.classList.add("modify-comment");
  }
  targetElement.appendChild(button);
}

function displayDeleteButton(elementType, targetElement) {
  let button = document.createElement("button");
  button.innerHTML = '<i class="fas fa-trash-alt"></i> Supprimer';
  if (elementType === "post") {
    button.addEventListener("click", deletePost);
    button.classList.add("delete-post");
  } else if (elementType === "comment") {
    button.addEventListener("click", deleteComment);
    button.classList.add("delete-comment");

  }
  targetElement.appendChild(button);
}

/**
 * L'utilisateur est connecté
 *  → Afficher le fil d'actualités
 * L'utilisateur n'est pas connecté
 *  → Afficher les possibilités d'authentification
 */

function whatToDisplayDependingOnTheUserLoginStatus(userIsConnected) {
  if (userIsConnected) {
    if (DEBUG) console.log(`L'utisateur est connecté.`, `\n`, `Boutons d'authentification cachés.`);
    document.querySelector(".user-is-disconnected").style.display = "none";
  } else {
    if (DEBUG) console.log(`L'utisateur n'est pas connecté.`, `\n`, `Fil d'actualités caché.`);
    document.querySelector(".user-is-connected").style.display = "none";
  }
}

/**
 * Supprime le jeton d'authentification et l'identifiant de l'utilisateur dans le sessionStorage
 */
function logOut() {
  if (DEBUG) console.group(`L'utisateur se déconnecte.`);
  sessionStorage.removeItem("token");
  if (DEBUG) console.log(`Token d'authentification et identifiant de l'utilisateur supprimés.`);
  redirectToHomePage()
  if (DEBUG) console.groupEnd();
}

function addLinkToUserConnectedProfile(userId) {
  let profilePageLocation = `frontend/html/profile.html`,
    urlToUserProfilePage;

  if (window.location.origin !== "null") {
    urlToUserProfilePage = `${window.location.origin}/${profilePageLocation}?id=${userId}`;
  } else {
    urlToUserProfilePage = `${window.location.href.split("/frontend/html")[0]}/${profilePageLocation}?id=${userId}`;
  }
  document.querySelector("#my-profile").setAttribute("href", urlToUserProfilePage);
}

function canTheUserAccessThisPage(userIsConnected) {
  if (!userIsConnected) {
    if (DEBUG) console.log(`L'utilisateur n'est pas connecté`, `Il ne peut pas accéder à cette page.`);
    redirectToHomePage();
  }
}

let userIsConnected, userIsAdmin, userId,
  userLocation = window.location.pathname.split("html/")[1];