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