function createPost() {

  let text = document.querySelector("#new-post"),
    illustration = document.querySelector("#new-post-illustration");

  const formData = new FormData();
  formData.append("text", text.value);
  formData.append("picture", illustration.files[0]);


  let request = {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain, multipart/form-data, */*",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
    },
    body: formData
  }

  fetch(`http://localhost:${PORT}/posts`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(result => {
      if (DEBUG) console.group(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post crée !`);
      if (DEBUG) console.log(`Champ de saisie vidé !`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyPost() {
  let post = this.closest("*[data-id]"),
    postId = post.dataset.id;

  if (document.querySelector(`*[data-id="${postId}"] .post-text-edit`) === null) {
    let oldTextElement = document.querySelector(`*[data-id="${postId}"] .post-text`),
      form = document.createElement(`form`),
      newTextElement = document.createElement(`textarea`),
      newInputElement = document.createElement(`input`);

    newInputElement.classList.add("post-illustration-edit");
    newInputElement.setAttribute("type", "file");
    newInputElement.setAttribute("name", "picture");
    form.setAttribute("name", "form");
    form.setAttribute("id", "form");
    form.setAttribute("enctype", "multipart/form-data");

    newTextElement.classList.add("post-text-edit");
    newTextElement.value = oldTextElement.textContent;
    post.replaceChild(form, oldTextElement);
    form.appendChild(newTextElement);
    form.appendChild(newInputElement)
  } else {
    let text = document.querySelector(`*[data-id="${postId}"] textarea`).value,
      illustration = document.querySelector(`*[data-id="${postId}"] input`),
      formData = new FormData();

    formData.append("text", text);
    formData.append("picture", illustration.files[0]);

    let request = {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain, multipart/form-data, */*",
        "Authorization": `Bearer ${sessionStorage.getItem("token")}` // ne cause pas l'échec de la requête même si aucun token n'est enregistré
      },
      body: formData
    }

    fetch(`http://localhost:${PORT}/posts/${postId}`, request)
      .then(result => result.json())
      .then(data => data.result[0])
      .then(comment => {
        if (DEBUG) console.group(`Modification d'un post.`);
        if (DEBUG) console.log(`Requête envoyée :`, request);
        if (DEBUG) console.log(`Post modifié !`);
        if (DEBUG) console.log(`Réactualisation de la page.`);
        if (DEBUG) console.groupEnd();
        window.location.reload();
      })
  }
}

function deletePost() {
  let postId = this.closest("*[data-id]").dataset.id;
  let request = getTheApiRequest(null, "DELETE", "application/json");

  fetch(`http://localhost:${PORT}/posts/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(post => {
      if (DEBUG) console.log(post);
      if (DEBUG) console.group(`Suppression d'un post.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Post supprimé !`);
      if (userLocation === "home.html") {
        if (DEBUG) console.log(`Réactualisation de la page.`);
        if (DEBUG) console.groupEnd();
        window.location.reload();
      } else {
        redirectToHomePage()
        if (DEBUG) console.groupEnd();
      }
    })
}

function getAllPosts() {
  let request = getTheApiRequest(null, "GET");
  fetch(`http://localhost:${PORT}/posts`, request)
    .then(result => {
      return result.json();
    })
    .then(data => {
      userIsAdmin = data.userIsAdmin;
      userIsConnected = data.userIsConnected;
      userId = data.userId;
      whatToDisplayDependingOnTheUserLoginStatus(userIsConnected);
      addLinkToUserConnectedProfile(userId);
      return data.result;
    })
    .then(posts => {
      if (DEBUG) console.log(`Récupération de tous les posts`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      posts.forEach(post => {
        displayOnePost(post);
        displayCommentsForOnePost(post.id);
      });
    })
}

function getOnePost() {
  let urlParameterPostId = getUrlParameters("id");
  let request = getTheApiRequest(null, "GET", "application/json");
  fetch(`http://localhost:${PORT}/posts/${urlParameterPostId}`, request)
    .then(result => result.json())
    .then(data => {
      userIsAdmin = data.userIsAdmin;
      userIsConnected = data.userIsConnected;
      userId = data.userId;
      canTheUserAccessThisPage(data.userIsConnected);
      return data.result[0];
    })
    .then(post => {
      if (DEBUG) console.group(`Récupération du post : ${urlParameterPostId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      displayOnePost(post);
      displayCommentsForOnePost(urlParameterPostId);
      console.groupEnd();
    })
}

function displayOnePost(post) {

  if (DEBUG) console.group(`Post n°${post.id}`);
  if (DEBUG) console.log(post);
  if (DEBUG) console.groupEnd();

  let postsContainer = document.querySelector("#posts-container"),
    postContainer = document.createElement("div"),
    postInformations = document.createElement("div"),
    ownerInformationsContainer = document.createElement("a"),
    buttonsContainer = document.createElement("div"),
    commentsContainer = document.createElement("div"),
    commentsContainerTitle = document.createElement("h2"),
    createCommentContainer = document.createElement("div");

  postContainer.dataset.user = post.id_user;
  postContainer.dataset.id = post.id;
  postContainer.classList.add("post");
  buttonsContainer.classList.add("buttons-container");
  commentsContainer.classList.add("comments-container");
  postInformations.classList.add("post-informations");
  commentsContainerTitle.textContent = "Commentaires";

  postsContainer.appendChild(postContainer);
  postContainer.appendChild(postInformations);

  postInformations.appendChild(ownerInformationsContainer);
  displayUserInformationsToTheElement(post, ownerInformationsContainer)
  displayDateTimeToTheElement(post, "post", postInformations);
  if (post.illustration !== "") {
    displayIllustrationToTheElement(post, "post", postContainer);
  }
  displayTextToTheElement(post, "post", postContainer);

  if (userLocation === "home.html") {
    displayLinkToThePost(post, buttonsContainer);
  };

  if (userId === post.id_user || userIsAdmin) {
    displayModifyButton("post", buttonsContainer);
    displayDeleteButton("post", buttonsContainer);
  }

  postContainer.appendChild(buttonsContainer);
  postContainer.appendChild(commentsContainer);
  commentsContainer.appendChild(commentsContainerTitle);
  postContainer.appendChild(createCommentContainer);
  getStuffToCreateComment(createCommentContainer);
}

function initializeTheHomeAndPostsPages() {
  if (userLocation === "home.html") {
    if (DEBUG) console.log(`L'utilisateur est sur la page d'accueil.`)
    if (sessionStorage.getItem("token") === null) {
      whatToDisplayDependingOnTheUserLoginStatus(false);
    } else {
      getAllPosts();
    }
  } else if (userLocation === "post.html") {
    getOnePost();
  }
}

initializeTheHomeAndPostsPages();