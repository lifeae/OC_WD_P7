let urlParameterUserId = getUrlParameters('id');

function getProfile() {
  if (DEBUG) console.groupCollapsed("Récupération du profil : ");

  let request = getTheApiRequest(null, 'GET');
  if (DEBUG) console.log(`Envoi de la requête :`, request);

  fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(userProfile => {
      if (DEBUG) console.log("Profil récupéré : ", userProfile);
      displayProfile(userProfile);
      displayAdminStatus(userProfile);
      if (DEBUG) console.groupEnd();
    });
}

function displayProfile(userProfile) {
  // Récupérer les différents champs dans le fichier html
  let firstname = document.querySelector('#firstname'),
    lastname = document.querySelector('#lastname'),
    email = document.querySelector('#email'),
    position = document.querySelector('#position'),
    phone = document.querySelector('#phone');

  // Les remplir
  firstname.value = userProfile.firstname;
  lastname.value = userProfile.lastname;
  email.value = userProfile.email;
  position.value = userProfile.position;
  phone.value = userProfile.phone;
}

function displayAdminStatus(userProfile) {
  if (userProfile.is_admin === 1) {
    let adminStatus = document.createElement("p");
    adminStatus.innerHTML = "Vous êtes administrateur."
    let userInformations = document.querySelector(".user-informations");
    userInformations.appendChild(adminStatus);
  }
}

function modifyProfile() {
  if (DEBUG) console.groupCollapsed("Modification du profil de l'utilisateur.");

  // Récupérer les différents champs dans le fichier html
  let firstname = document.querySelector('#firstname'),
    lastname = document.querySelector('#lastname'),
    email = document.querySelector('#email'),
    position = document.querySelector('#position'),
    phone = document.querySelector('#phone');

  let body = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    position: position.value,
    phone: phone.value,
  };

  let request = getTheApiRequest(body, 'PUT');
  if (DEBUG) console.log(`Envoi de la requête :`, request);

  fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(userProfile => {
      if (DEBUG) console.log("Profil modifié !");
      if (DEBUG) console.groupEnd();
      // Réactualiser les données de la page
      getProfile();
    });
}

function deleteProfile() {
  if (DEBUG) console.groupCollapsed("Demande de suppression du compte de l'utilisateur.");
  let securityCheck = prompt("Êtes-vous certain de vouloir supprimer ce compte ? Si vous êtes sûrs, écrivez : 'SUPPRIMER'");
  if (securityCheck === 'SUPPRIMER') {
    let request = getTheApiRequest(null, 'DELETE');
    if (DEBUG) console.log(`Envoi de la requête :`, request);

    fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
      .then(result => {
        if (DEBUG) console.log("Compte supprimé !");
        logOut();
        if (DEBUG) console.groupEnd();
      });
  }
}

getProfile();