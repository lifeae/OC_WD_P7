import React, { Component, Fragment } from 'react';
import DEBUG from '../debug';

class Login extends Component {

  render() {
    if (DEBUG) console.log("L'utilisateur souhaite se connecter.");
    return (
      <Fragment>
        <h1>Connexion</h1>
        <div id='form'>
          <label htmlFor='email'>Email</label>
          <input placeholder='Email' type='text' id='email' ></input>
          <label htmlFor='password'>Mot de passe</label>
          <input type='password' id='password' placeholder='Mot de passe'></input>
        </div>
        <button onClick={this.attempt}>Go !</button>
      </Fragment>
    );
  }

  attempt(props) {
    if (DEBUG) console.group(`Lancement de la procédure de connexion ...`);

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
    fetch('http://localhost:3000/auth/login', request)
      .then(result => {
        if (DEBUG) {
          if (result.status === 200) {
            console.log(`La connexion a fonctionnée.`);
          } else {
            console.log(`La connexion n'a pas fonctionnée.`);
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
        }
        if (DEBUG) console.log(`Fin de la procédure de connexion.`);
        if (DEBUG) console.groupEnd();

        if (sessionStorage.getItem('token') !== null) {
          return this.props.location.state = true;
        } else {
          return this.props.location.state = false;
        }
      });
  }
}

export default Login;