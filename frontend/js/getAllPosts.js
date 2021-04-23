function getAllPosts() {
  // Préparation des paramètres de la requête
  let headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  };

  // Assemblage de la requête
  let request = {
    method: 'GET',
    headers: headers
  }

  fetch('http://localhost:3000/posts', request)
    .then(result => result.json())
    .then(result => console.log(result))
  // Changer de page ?
}

getAllPosts();