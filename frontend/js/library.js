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