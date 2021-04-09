import React, {Component, Fragment} from 'react';
import DEBUG from '../debug';

function DisplayAllPosts() {
  return (
    <Fragment>
      <h2>GetAllPosts</h2>
    </Fragment>
  );
}

function getAllPosts() {
  // Préparation des paramètres de la requête
  let headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTYxNzI3OTM2NiwiZXhwIjoxNjE3MzY1NzY2fQ.DdvuKiKXcwTk3eXYjBw7wwXLBWpo64dkruRG2KeyFBw'
  };

  // Assemblage de la requête
  let request = {
    method: 'GET',
    headers: headers
  }

  fetch('http://localhost:3000/posts', request)
  .then(result => console.log(result));
  // Changer de page ?
}

export default GetAllPosts;
