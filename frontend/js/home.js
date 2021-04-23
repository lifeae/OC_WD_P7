/**
 * Check le localStorage pour vérifier la présence ou l'absence du jeton d'authentification
 */

function checkIfTheUserIsConnected() {
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

function whatToDoDependingOnTheUserLoginStatus() {
  if (checkIfTheUserIsConnected()) {
    if (DEBUG) console.log("L'utisateur est connecté.", "\n", "Boutons d'authentification cachés.");
    document.querySelector(".user-is-disconnected").style.display = "none";
    
  } else {
    if (DEBUG) console.log("L'utisateur n'est pas connecté.", "\n", "Fil d'actualités caché.");
    document.querySelector(".user-is-connected").style.display = "none";

  }
}

/**
 * 
 */
function logOut() {
  if (DEBUG) console.group("L'utisateur souhaite se déconnecter.");
  sessionStorage.removeItem('token');
  if (DEBUG) console.log("Token d'authentification supprimé.", "Redirection vers la page d'accueil.");
  let homePageLocation = `frontend/html/home.html`,
      urlToHomePage = `${window.location.origin}/${homePageLocation}`;
  window.location.replace(urlToHomePage);
  if (DEBUG) console.groupEnd();
}

whatToDoDependingOnTheUserLoginStatus();