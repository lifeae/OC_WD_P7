function login() {
  // Récupérer les entrées dans les inputs
  let email = document.querySelector("#email").value,
    password = document.querySelector("#password").value;

  let body = {
    email: email,
    password: password
  };

  // Envoyer ces données au backend
  let request = getTheApiRequest(body, "POST", "application/json");

  fetch(`http://localhost:${PORT}/auth/login`, request)
    .then(result => {
      if (DEBUG) console.log(result);
      if (DEBUG) console.group(`Lancement de la procédure de connexion ...`);
      if (DEBUG) console.log(`Récupération des inputs dans le front :`, `\n`, `email : ${email}`, `\n`, `mot de passe : ${password}`);
      if (DEBUG) {
        if (result.status === 200) {
          if (DEBUG) console.log(`La connexion a fonctionnée.`);
        } else {
          if (DEBUG) console.log(`La connexion n'a pas fonctionné.`);
        }
      }
      return result.json();
    })
    .then(user => {
      if (DEBUG) console.log(`Token :`, `\n`, user.token);
      if (DEBUG) console.log(`Fin de la procédure de connexion.`);
      if (DEBUG) console.groupEnd();
      if (user.token !== undefined) {
        sessionStorage.setItem("token", user.token);
        redirectToHomePage();
      } else {
        displayErrorMessage(user.error);
      }
    })
}

function signup() {
  // Récupérer les entrées dans les inputs
  let email = document.querySelector("#email").value,
    firstPassword = document.querySelector("#password").value,
    secondPassword = document.querySelector("#password2").value,
    body = {
      email: email,
      firstPassword: firstPassword,
      secondPassword: secondPassword
    };

  // Envoyer ces données au backend
  let request = getTheApiRequest(body, "POST", "application/json");

  fetch(`http://localhost:${PORT}/auth/signup`, request)
    .then(result => {
      if (DEBUG) console.group(`Lancement de la procédure d'inscription ...`);
      if (DEBUG) console.log(`Récupération des inputs dans le front :`, `\n`, `email : ${email}`, `\n`, `mot de passe 1 : ${firstPassword}`, `\n`, `mot de passe 2 : ${secondPassword}`);
      if (DEBUG) {
        if (result.status === 200) {
          if (DEBUG) console.log(`La connexion a fonctionnée.`);
        } else {
          if (DEBUG) console.log(`La connexion n'a pas fonctionné.`);
        }
      }
      console.log(result);
      return result.json();
    })
    .then(user => {
      if (DEBUG) console.log(`Fin de la procédure d'inscription.`);
      if (DEBUG) console.groupEnd();
      if (user.error) {
        displayErrorMessage(user.error)
      } else {
        login();
      }
    })
}