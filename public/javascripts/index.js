// Loading content and navbar
async function init() {
  await loadIdentity();
  allPost();
  document.querySelector("#search-term").addEventListener("input", searchBar);
  document.getElementById("home-btn").addEventListener("click", homeButton);
  document.getElementById("post-btn").addEventListener("click", async function () {
    try {
      const identityResponse = await fetch('api/users/myIdentity');
      const identityInfo = await identityResponse.json();
      // Ensure that the user must be logged in for them to post
      if (identityInfo.status === "loggedin") {
        window.location.href = 'createpost.html';
      } else {
        alert("Must be logged in to create posts!")
        }
    } catch (error) {
      console.error("logging in", error)
    }
  });
}

// Helper function that ensures that the like button is available only if the user is loggedin
async function hideLikes() {
  const identityResponse = await fetch('api/users/myIdentity');
  const identityInfo = await identityResponse.json();
  let likeButtons = document.getElementsByClassName('like-btn');
  if (identityInfo.status == "loggedin") {
    for (var i = 0; i < likeButtons.length; i++) {
        likeButtons[i].classList.remove('hidden');
    }
  } else {
    for (var i = 0; i < likeButtons.length; i++) {
        likeButtons[i].classList.add('hidden');
    }
  }
}

// Function to get and display all posts
async function allPost() {
  document.getElementById("description").innerText = "Loading...";
  try {
    if (sessionStorage.getItem('selectedTag')) {
      tagSearch(sessionStorage.getItem('selectedTag'))
    } else if (sessionStorage.getItem('searchQuery')) {
      searchPost()
    }
    else {
      // Use posts get endpoint
      let response = await fetch(`api/posts`);
      let postsJson = await response.json();

      for (let i = 0; i < postsJson.length; i++) {
        let specificData = postsJson[i];
        let container = postCard(specificData);
        document.getElementById("home").prepend(container);
      }
      document.getElementById("description").innerText = "Welcome!";
    } // takes out loading text after posts load
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    // Display an error message on the homepage if something does not work
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
  }
}

// Searchbar helper function
function searchBar(event) {
  let search = event.target.value.trim()
  // Disables search button if search value is blank
  if (search === "") {
    document.getElementById("search-btn").disabled = true
  } else {
    document.getElementById("search-btn").disabled = false
    document.getElementById("search-btn").addEventListener("click", searchPost)
  }
}

// Function for searching for posts
async function searchPost() {
  document.getElementById("description").innerText = "Loading...";
  document.getElementById("home").classList.remove("hidden");
  let search = sessionStorage.getItem('searchQuery') || document.getElementById("search-term").value;

  try {
    let response = await fetch(`api/posts?search=${search}`);
    let postsJson = await response.json();
    document.getElementById("home").innerHTML = ""
    // Searching through posts
    for (let i = 0; i < postsJson.length; i++) {
      let specificData = postsJson[i];
      let container = postCard(specificData);
      document.getElementById("home").appendChild(container);
    }
    document.getElementById("description").innerHTML = `Posts including: "${search}"`
    sessionStorage.removeItem('searchQuery');

    // Error handling for search
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
    sessionStorage.removeItem('searchQuery');
  }
}

// Function for searching for posts based on hashtag
async function tagSearch(event) {
  document.getElementById("description").innerText = "Loading...";
  let tag = sessionStorage.getItem('selectedTag') || event.target.textContent.substring(1);

  try {
    // Fetching for posts based on post tag
    let response = await fetch(`api/posts?tag=${tag}`);
    let postsJson = await response.json();
    document.getElementById("home").innerHTML = ""

    for (let i = 0; i < postsJson.length; i++) {
      let specificData = postsJson[i];
      let container = postCard(specificData);
      document.getElementById("home").appendChild(container);
    }
    document.getElementById("description").innerHTML = `Tags including: "${tag}"`
    sessionStorage.removeItem('selectedTag');

    // Error handling
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
    sessionStorage.removeItem('selectedTag');
  }
}

// Return to home button function
function homeButton() {
  window.location.href = '/';
}

// Creating postcard function
function postCard(data) {
  let container = document.createElement("article")
  container.classList.add("card")
  container.id = data["id"]

  // Attach basic user information and content to the post
  let username = data["name"];
  let indivName = document.createElement("a");
  indivName.classList.add("individual");
  indivName.textContent = username;
  indivName.href = `/userInfo.html?user=${encodeURIComponent(username)}`;
  let firstDiv = document.createElement("div");
  firstDiv.appendChild(indivName);

  let extraInfo = document.createElement("p")
  extraInfo.classList.add("user-time")
  // Error handling for if no post is found
  if (!data["post"]) {
    data["post"] = "No post available";
  }
  // Date formatting so the date looks bettter
  let formattedDate = formatDate(data["created_date"]);
  extraInfo.textContent = data["username"] + " posted on " + formattedDate;
  let postContent = document.createElement("p");
  let title = document.createElement("h1");
  title.textContent = data["title"];
  // Appending title and textcontent to the post
  firstDiv.appendChild(title);
  postContent.textContent = data["post"];
  firstDiv.appendChild(postContent);

  // Code displaying all the hashtags associated with the post
  const hashTagString = data["hashtag"][0];
  const hashTagArr = hashTagString.split(',');
  if (Array.isArray(hashTagArr) && hashTagArr.length > 0) {
    hashTagArr.map(tag => {
      allTags = document.createElement("p")
      allTags.textContent = '#' + tag.trim()
      allTags.style.fontStyle = "italic";
      allTags.style.color = "blue"
      allTags.style.display = 'inline-block'
      allTags.style.textIndent = "10px"
      allTags.addEventListener("click", tagSearch)
      firstDiv.appendChild(allTags);
    })
  }

  // Code adding the likebutton and count functionality to each post
  let likeBtn = document.createElement("button");
  likeBtn.innerHTML = "&#x2764;";
  likeBtn.classList.add("like-btn");
  likeBtn.style.borderRadius = "5px";
  likeBtn.style.border = "none";

  let likeCount = document.createElement("span");
  likeCount.textContent = data.likes.length + " Likes";
  likeCount.classList.add('like-count');
  likeCount.style.fontWeight = "bold";

  firstDiv.appendChild(likeBtn);
  firstDiv.appendChild(likeCount);
  // Like button functionality
  function handleLikeButtonClick() {
    if (data["likes"].indexOf(username) === -1) {
      // Adds like if the user is not already in the likes array
      data["likes"].push(username);
      likeCount.textContent = data.likes.length + " Likes";
      likePost(data.id);
    } else {
      // Otherwise unlikes the post
      const index = data["likes"].indexOf(username);
      if (index !== -1) {
        data["likes"].splice(index, 1);
        likeCount.textContent = data.likes.length + " Likes";
        unlikePost(data.id);
      }
    }
  }
  likeBtn.addEventListener("click", handleLikeButtonClick);

  // Ensures the likes are hidden if the user is not logged in
  hideLikes();

  // Adds the viewpost button to each post, so users can view posts individually and add comments
  let viewPostBtn = document.createElement("button")
  viewPostBtn.classList.add("viewbtn");
  viewPostBtn.textContent = "View Post!"
  viewPostBtn.addEventListener("click", function() {
    userPost(data["id"]);
  })
  firstDiv.appendChild(extraInfo)
  firstDiv.appendChild(viewPostBtn);
  container.appendChild(firstDiv)
  return container
}

// Format date into more readable form helper function
function formatDate(tempTime) {
  let currDate = new Date(tempTime);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  let formattedDate = currDate.toLocaleDateString('en-US', options)
  return formattedDate;
}

// Call to the like router
async function likePost(postID) {
  await fetchJSON(`api/posts/like`, {
      method: "POST",
      body: {postID: postID}
  })
}

// Call to the unlike router
async function unlikePost(postID){
  await fetchJSON(`api/posts/unlike`, {
      method: "POST",
      body: {postID: postID}
  })
}

// Function that brings user to view an individual post and add comments
async function userPost(postID) {
  window.location.href = `viewpost.html?id=${postID}`;
}
