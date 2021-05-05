function login() {
  // Récupérer les entrées dans les inputs
  let email = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;

  // Envoyer ces données au backend
  let request = getTheApiRequest({
    email: email,
    password: password
  }, 'POST');

  fetch(`http://localhost:3000/auth/login`, request)
    .then(result => {
      if (DEBUG) console.groupCollapsed(`Lancement de la procédure de connexion ...`);
      if (DEBUG) console.log(`Récupération des inputs dans le front :`, `\n`, `email : ${email}`, '\n', `mot de passe : ${password}`);
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
      if (DEBUG) {
        if (DEBUG) console.log(`Token :`, `\n`, user.token);
      }
      if (DEBUG) console.log(`Fin de la procédure de connexion.`);
      if (DEBUG) console.groupEnd();
      if (user.token !== undefined) {
        sessionStorage.setItem('token', user.token);
        sessionStorage.setItem('userId', user.userId);
        redirectToHomePage();
      }
    });
}

function signup() {
  // Récupérer les entrées dans les inputs
  let email = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;

  // Envoyer ces données au backend
  let request = getTheApiRequest({
    email: email,
    password: password
  }, 'POST');

  fetch(`http://localhost:3000/auth/signup`, request)
    .then(result => {
      if (DEBUG) console.groupCollapsed(`Lancement de la procédure d'inscription ...`);
      if (DEBUG) console.log(`Récupération des inputs dans le front :`, `\n`, `email : ${email}`, '\n', `mot de passe : ${password}`);
      if (DEBUG) {
        if (result.status === 200) {
          if (DEBUG) console.log(`L'inscription a fonctionnée.`);
        } else {
          if (DEBUG) console.log(`L'inscription n'a pas fonctionnée.`);
        }
      }
      return login();
    })

}