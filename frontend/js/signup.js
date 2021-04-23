let homePage = ``;



function signUp() {
  if (DEBUG) console.group(`Lancement de la procédure d'inscription ...`);

  // Récupérer les entrées dans les inputs
  let email = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;

  if (DEBUG) console.log(`Récupération des inputs dans le front :`, `\n`, `email : ${email}`, '\n', `mot de passe : ${password}`);

  // Envoyer ces données au backend

  // Préparation des paramètres de la requête
  let headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYxNzI3OTM2NiwiZXhwIjoxNjE3MzY1NzY2fQ.DdvuKiKXcwTk3eXYjBw7wwXLBWpo64dkruRG2KeyFBw'
  },
    body = {
      email: email,
      password: password
    };

  // Assemblage de la requête
  let request = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers
  }

  if (DEBUG) console.log(`Envoi de la requête au backend ...`);
  fetch('http://localhost:3000/auth/signup', request)
    .then(result => {
      if (DEBUG) {
        if (result.status === 200) {
          console.log(`L'inscription a fonctionnée.`);
        } else {
          console.log(`L'inscription n'a pas fonctionnée.`);
        }
      }
      return result.json()
    })
    .then(result => {
      if (DEBUG) {
        console.log(`Token :`, `\n`, result.token);
      }
      if (result.token !== undefined) {
        sessionStorage.setItem('token', result.token);
        let homePageLocation = `frontend/html/home.html`,
            urlToHomePage = `${window.location.origin}/${homePageLocation}`;
        window.location.replace(urlToHomePage);
      }
      if (DEBUG) console.log(`Fin de la procédure d'inscription.`);
      if (DEBUG) console.groupEnd();
    });
}