function displayCommentsForOnePost(postId) {
  let request = getTheApiRequest(null, "GET", "application/json");
  fetch(`http://localhost:${PORT}/comments/${postId}`, request)
    .then(result => result.json())
    .then(data => data.result)
    .then(comments => {
      if (DEBUG) console.group(`Commentaires du post n°${postId}`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) {
        if (comments.length === 0) if (DEBUG) console.log(`Ce post ne possède pas de commentaires.`);
      }
      comments.forEach(comment => {
        if (DEBUG) console.log(`Commentaire récupéré : `, comment);
        displayOneComment(comment, postId);
      });
      if (DEBUG) console.groupEnd();
    })
}

function displayOneComment(comment) {

  let commentContainer = document.createElement("div"),
    commentInformations = document.createElement("div"),
    ownerInformationsContainer = document.createElement("a"),
    buttonsContainer = document.createElement("div"),
    targetElement = document.querySelector(`[data-id="${comment.id_post}"] .comments-container`);


  commentContainer.dataset.user = comment.id_user;
  commentContainer.dataset.id = comment.id;
  commentContainer.classList.add("comment");
  buttonsContainer.classList.add("buttons-container");
  commentInformations.classList.add("comment-informations");



  targetElement.appendChild(commentContainer);
  commentContainer.appendChild(commentInformations);
  commentInformations.appendChild(ownerInformationsContainer);
  commentContainer.appendChild(buttonsContainer);

  displayUserInformationsToTheElement(comment, ownerInformationsContainer);
  displayDateTimeToTheElement(comment, "comment", commentInformations);
  displayTextToTheElement(comment, "comment", commentContainer);

  if (userId === comment.id_user || userIsAdmin) {
    displayModifyButton("comment", buttonsContainer);
    displayDeleteButton("comment", buttonsContainer);
  }
}

function getStuffToCreateComment(targetElement) {
  let textarea = document.createElement("textarea");

  textarea.setAttribute("placeholder", "Ecrivez un commentaire ...");
  textarea.classList.add("new-comment-textarea");
  validateButton = document.createElement("button");
  validateButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
  validateButton.classList.add("new-comment-submit");
  validateButton.addEventListener("click", createComment);

  targetElement.classList.add("new-comment-container");
  targetElement.appendChild(textarea);
  targetElement.appendChild(validateButton);
}

function createComment() {
  let postId = this.closest("*[data-id]").dataset.id,
    textarea = document.querySelector(`*[data-id="${postId}"] .new-comment-textarea`),
    body = {
      text: textarea.value,
      id_post: postId
    },
    request = getTheApiRequest(body, "POST", "application/json");

  fetch(`http://localhost:${PORT}/comments`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.group(`Création d'un nouveau commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Commentaire crée !`, comment);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}

function modifyComment() {

  let comment = this.closest("*[data-id]"),
    commentId = comment.dataset.id;

  if (document.querySelector(`*[data-id="${commentId}"] .comment-text-edit`) === null) {
    let oldCommentElement = document.querySelector(`*[data-id="${commentId}"] .comment-text`),
      newCommentElement = document.createElement(`textarea`);

    newCommentElement.classList.add("comment-text-edit");
    newCommentElement.value = oldCommentElement.textContent;
    comment.replaceChild(newCommentElement, oldCommentElement);

  } else {
    let newComment = document.querySelector(`*[data-id="${commentId}"] textarea`).value,
      body = {
        text: newComment
      };
    let request = getTheApiRequest(body, "PUT", "application/json");

    fetch(`http://localhost:${PORT}/comments/${commentId}`, request)
      .then(result => result.json())
      .then(data => data.result[0])
      .then(comment => {
        if (DEBUG) console.group(`Modification d'un commentaire.`);
        if (DEBUG) console.log(`Requête envoyée :`, request);
        if (DEBUG) console.log(`Commentaire crée !`, comment);
        if (DEBUG) console.log(`Réactualisation de la page.`);
        if (DEBUG) console.groupEnd();
        window.location.reload();
      })
  }
}

function deleteComment() {
  let commentId = this.closest("*[data-id]").dataset.id,
    request = getTheApiRequest(null, "DELETE", "application/json");

  fetch(`http://localhost:${PORT}/comments/${commentId}`, request)
    .then(result => result.json())
    .then(data => data.result[0])
    .then(comment => {
      if (DEBUG) console.log(comment);
      if (DEBUG) console.group(`Suppression d'un commentaire.`);
      if (DEBUG) console.log(`Requête envoyée :`, request);
      if (DEBUG) console.log(`Commentaire crée !`, comment);
      if (DEBUG) console.log(`Réactualisation de la page.`);
      if (DEBUG) console.groupEnd();
      window.location.reload();
    })
}