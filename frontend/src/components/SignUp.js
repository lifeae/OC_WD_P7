import React, {Component, Fragment} from 'react';
import Home from './Home';
import DEBUG from '../debug';

function SignUp() {
  return (
    <Fragment>
      <h1>Inscription</h1>
      <div id='form'>
        <label htmlFor='email'>Email</label>
        <input placeholder='Email' type='text' id='email' ></input>
        <label htmlFor='password'>Mot de passe</label>
        <input type='password' id='password' placeholder='Mot de passe'></input>
      </div>
      <button onClick={signUp}>Go !</button>
    </Fragment>
  );
}

function signUp() {
  if (DEBUG) console.group(`Lancement de la procédure de connexion ...`);

  // Récupérer les entrées dans les inputs
  let email = document.querySelector('#email').value;
  let password = document.querySelector('#password').value;

  if (DEBUG) console.log(`Récupération des inputs dans le front :`, `email : ${email}`, `mot de passe : ${password}`);

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
  if (DEBUG) console.log(`Envoi de la requête au backend ...`)
  fetch('http://localhost:3000/auth/signup', request)
  .then(result => {
    if (DEBUG) console.log(`Retour de la promesse : ${result}`);
    if (DEBUG) console.log(`Token : ${result}`);

    if (result.token !== undefined) {
      sessionStorage.setItem('token', result.token);
    }
  });
  // Changer de page ?
  redirectionToTheHomePage()
}

function redirectionToTheHomePage() {
  return (
    <h1>bitonio</h1>
  )
}

export default SignUp;
