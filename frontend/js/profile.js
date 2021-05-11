let urlParameterUserId = getUrlParameters("id");

function getProfile() {
  if (DEBUG) console.group(`Récupération du profil : `);

  let request = getTheApiRequest(null, "GET", "application/json");
  if (DEBUG) console.log(`Envoi de la requête :`, request);

  fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => {
      canTheUserAccessThisPage(data.userIsConnected);
      // l'utilisateur est propriétaire ou admin ? On lui présente les boutons de modification et de suppression
      displayModifyAndDeleteButtons(data.userId, data.userIsAdmin);
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
  // Récupérer les différents champs dans le fichier html
  let firstname = document.querySelector("#firstname"),
    lastname = document.querySelector("#lastname"),
    email = document.querySelector("#email"),
    position = document.querySelector("#position"),
    phone = document.querySelector("#phone");

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
    adminStatus.innerHTML = "Administrateur : Oui";
    let userInformations = document.querySelector(".user-informations");
    userInformations.prepend(adminStatus);
  }
}

function modifyProfile() {
  if (DEBUG) console.group(`Modification du profil de l'utilisateur.`);
  let firstname = document.querySelector("#firstname").value,
    lastname = document.querySelector("#lastname").value,
    email = document.querySelector("#email").value,
    position = document.querySelector("#position").value,
    phone = document.querySelector("#phone").value;

  let picture = document.querySelector("#profil-picture").files[0]

  // let body = {
  //   firstname: firstname,
  //   lastname: lastname,
  //   email: email,
  //   picture: picture,
  //   position: position,
  //   phone: phone
  // }

  let form = document.querySelector("form");
  const formData = new FormData(form);
  let body = {};

  for (var pair of formData.entries()) {
    body[pair[0]] = pair[1];
  }

  body.picture = picture;

  console.log(body);

  let request = getTheApiRequest(body, "PUT", "multipart/form-data; boundary=yolo");
  if (DEBUG) console.log(`Envoi de la requête :`, request);

  fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(userProfile => {
      if (DEBUG) console.log(`Profil modifié !`);
      if (DEBUG) console.groupEnd();
      // Réactualiser les données de la page
      window.location.reload();
    });
}

function deleteProfile() {
  if (DEBUG) console.group(`Demande de suppression du compte de l'utilisateur.`);
  let securityCheck = prompt('Êtes-vous certain de vouloir supprimer ce compte ? Si vous êtes sûrs, écrivez : "SUPPRIMER"');
  if (securityCheck === "SUPPRIMER") {
    let request = getTheApiRequest(null, "DELETE", "application/json");
    if (DEBUG) console.log(`Envoi de la requête :`, request);

    fetch(`http://localhost:3000/user/profile/${urlParameterUserId}`, request)
      .then(result => {
        if (DEBUG) console.log(`Compte supprimé !`);
        logOut();
        if (DEBUG) console.groupEnd();
      });
  }
}

function displayModifyAndDeleteButtons(userId, userIsAdmin) {
  let userIsOwnerOfThisElement = (urlParameterUserId == userId ? true : false);
  if (userIsOwnerOfThisElement || userIsAdmin) {
    if (DEBUG) console.log(`L'utisateur est propriétaire ou administrateur.`, `\n`, `Boutons de modification et suppression affichés.`);
  } else {
    if (DEBUG) console.log(`L'utisateur n'est pas propriétaire ou administrateur.`, `\n`, `Boutons de modification et suppression cachés.`);
    document.querySelector(".modify-profile").style.display = "none";
    document.querySelector(".delete-profile").style.display = "none";
  }
}

getProfile();