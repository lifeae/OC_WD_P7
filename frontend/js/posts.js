function initializeTheHomeAndPostsPages() {
  if (userLocation === 'home.html' && isUserConnected()) {
    getAllPosts();
  } else if (userLocation === 'post.html') {
    getOnePost();
  }
}

initializeTheHomeAndPostsPages();