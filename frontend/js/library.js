function displayErrorMessage(error) {
  let previousErrorMessage = document.querySelector(".error");
  if (previousErrorMessage !== null) {
    previousErrorMessage.remove();
  }
  let errorMessage = document.createElement("p"),
    form = document.querySelector("#form");
  errorMessage.textContent = error;
  errorMessage.classList.add("error");
  form.appendChild(errorMessage);
}

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
  let headers;
  // Préparation des paramètres de la requête
  if (contentType !== null) {
    headers = {
      "Accept": "application/json, text/plain, multipart/form-data, */*",
      "Content-Type": contentType,
      "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
    };
  } else {
    headers = {
      "Accept": "application/json, text/plain, multipart/form-data, */*",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
    };
  }

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
  redirectToHomePage();
  if (DEBUG) console.groupEnd();
}


function canTheUserAccessThisPage(userIsConnected) {
  if (!userIsConnected) {
    if (DEBUG) console.log(`L'utilisateur n'est pas connecté`, `Il ne peut pas accéder à cette page.`);
    redirectToHomePage();
  }
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

function displayIllustrationToTheElement(element, elementType, elementContainer) {
  let illustration = document.createElement("img");
  elementContainer.appendChild(illustration);
  illustration.src = element.illustration;
  if (elementType === "post") {
    illustration.classList.add("post-illustration");
  } else if (elementType === "comment") {
    illustration.classList.add("comment-illustration");
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
    ownerPicture = document.createElement("img"),
    ownerName = document.createElement("p"),
    urlToUserProfilePage;

  if (window.location.origin !== "null") {
    urlToUserProfilePage = `${window.location.origin}/${profilePageLocation}?id=${element.id_user}`;
  } else {
    urlToUserProfilePage = `${window.location.href.split("/frontend/html")[0]}/${profilePageLocation}?id=${element.id_user}`;
  }

  ownerName.innerHTML = `${element.firstname} ${element.lastname}`;
  ownerName.classList.add("owner-name");
  ownerPicture.src = element.picture;
  ownerPicture.classList.add("owner-picture");
  targetElement.classList.add("owner-informations");
  targetElement.href = urlToUserProfilePage;

  targetElement.appendChild(ownerPicture);
  targetElement.appendChild(ownerName);
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

let userIsConnected, userIsAdmin, userId,
  userLocation = window.location.pathname.split("html/")[1];