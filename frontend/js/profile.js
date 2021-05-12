let urlParameterUserId = getUrlParameters("id");

/**
 * L'utilisateur est propriétaire ou admin
 *  → Afficher le formulaire de modification et de suppression
 * L'utilisateur n'est pas propriétaire ou admin
 *  → Afficher une présentation du profil sans modifications possibles
 */

function whatToDisplayDependingOnTheUserRightsOnThisProfile(userId, userIsAdmin) {
  let userIsOwnerOfThisElement = (urlParameterUserId == userId ? true : false);
  if (userIsOwnerOfThisElement || userIsAdmin) {
    if (DEBUG) console.log(`L'utisateur est propriétaire ou administrateur.`, `\n`, `Affichage du formulaire de modification/suppression.`);
    document.querySelector(".user-has-no-rights").style.display = "none";
  } else {
    if (DEBUG) console.log(`L'utisateur n'est pas propriétaire ou administrateur.`, `\n`, `Affichage du profil sans modifications possibles.`);
    document.querySelector(".user-has-rights").style.display = "none";
  }
}

function getProfile() {
  if (DEBUG) console.group(`Récupération du profil : `);

  let request = getTheApiRequest(null, "GET", "application/json");
  if (DEBUG) console.log(`Envoi de la requête :`, request);

  fetch(`http://localhost:${PORT}/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => {
      userId = data.userId;
      userIsAdmin = data.userIsAdmin;
      canTheUserAccessThisPage(data.userIsConnected);
      // l'utilisateur est propriétaire ou admin ? On lui présente les boutons de modification et de suppression
      whatToDisplayDependingOnTheUserRightsOnThisProfile(userId, userIsAdmin)
      return data.result[0];
    })
    .then(userProfile => {
      if (DEBUG) console.log(`Profil récupéré : `, userProfile);
      displayProfile(userProfile);
      displayAdminStatus(userProfile);
      if (DEBUG) console.groupEnd();
    });
}

function displayProfile(userProfile) {
  let picture = document.createElement("img"),
  userHasRightsElement = document.querySelector(".user-has-rights"),
  userHasNoRightsElement = document.querySelector(".user-has-no-rights"),
  title = document.querySelector("h1");

  title.innerHTML = `Profil de ${userProfile.firstname} ${userProfile.lastname}`;
  picture.classList.add("picture");

  if (userHasNoRightsElement.style.display === 'none') {
    // L'utilisateur a les droits
    let firstname = document.querySelector("#firstname"),
      lastname = document.querySelector("#lastname"),
      email = document.querySelector("#email"),
      position = document.querySelector("#position"),
      phone = document.querySelector("#phone");
    
    firstname.value = userProfile.firstname;
    lastname.value = userProfile.lastname;
    picture.src = userProfile.picture;
    email.value = userProfile.email;
    position.value = userProfile.position;
    phone.value = userProfile.phone;

    userHasRightsElement.prepend(picture);
  } else {
    // L'utilisateur n'a pas les droits
    let email = document.querySelector(".email"),
    position = document.querySelector(".position"),
    phone = document.querySelector(".phone");
    
    picture.src = userProfile.picture;
    email.innerHTML = userProfile.email;
    email.href = `mailto:${userProfile.email}`;
    position.innerHTML = userProfile.position;
    phone.innerHTML = userProfile.phone;
    phone.href = `tel:${userProfile.phone}`;

    userHasNoRightsElement.prepend(picture);
  }
}

function displayAdminStatus(userProfile) {
  if (userProfile.is_admin === 1) {
    let adminStatus = document.createElement("p");
    adminStatus.innerHTML = "Administrateur : Oui";
    let userInformations = document.querySelector(".user-informations");
    userInformations.prepend(adminStatus);
  }
}

function modifyProfile() {
  
  if (DEBUG) console.group(`Modification du profil de l'utilisateur.`);
  const form = document.querySelector("#form");

  const formData = new FormData(form);

  let request = {
    method: "PUT",
    headers: {
      "Accept": "application/json, text/plain, multipart/form-data, */*",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
    },
    body: formData
  }

  if (DEBUG) console.log(`Envoi de la requête :`, request);
    fetch(`http://localhost:${PORT}/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(userProfile => {
      if (DEBUG) console.log(`Profil modifié!`);
      if (DEBUG) console.groupEnd();
      // Réactualiser les données de la page
      window.location.reload();
    })
    .catch(console.error)
}

function deleteProfile() {
  if (DEBUG) console.group(`Demande de suppression du compte de l'utilisateur.`);
  let securityCheck = prompt('Êtes-vous certain de vouloir supprimer ce compte ? Si vous êtes sûrs, écrivez : "SUPPRIMER"');
  if (securityCheck === "SUPPRIMER") {
    let request = getTheApiRequest(null, "DELETE");
    if (DEBUG) console.log(`Envoi de la requête :`, request);

    fetch(`http://localhost:${PORT}/user/profile/${urlParameterUserId}`, request)
      .then(result => {
        console.log()
        if (DEBUG) console.log(`Compte supprimé !`);
        if (urlParameterUserId == userId) {
          logOut();
        }
        if (DEBUG) console.groupEnd();
      });
  }
}

getProfile();