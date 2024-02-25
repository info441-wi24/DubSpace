// import { login as authLogin } from './auth.js'; Needa set up auth.js

window.addEventListener("load", init);

function init() {
  allPost();
  document.querySelector("#search-term").addEventListener("input", searchBar);
  document.getElementById("home-btn").addEventListener("click", homeButton);
  document.getElementById("post-btn").addEventListener("click", postCard);
  //document.getElementById("login-btn").addEventListener("click", handleLogin);
}

async function allPost() {
  document.getElementById("description").innerText = "Loading...";
  try {
      let response = await fetch(`api/posts`);
      let postsJson = await response.json();

      for (let i = 0; i < postsJson.length; i++) {
          let specificData = postsJson["posts"][i];
          let container = postCard(specificData);
          document.getElementById("home").appendChild(container);
      }
  } catch (error) {
      console.error("Error fetching posts:", error);
  }
}

// TODO: Handle searchbar functions, currently just a dummy function to avoid error
function searchBar(event) {
    // Dummy implementation
    console.log("Search bar input:", event.target.value);
}

function homeButton() {
  location.reload();
}
function postCard(data) {
  let container = document.createElement("article")
  container.classList.add("card")
  container.id = data["id"]

  let username = data["name"]
  let indivName = document.createElement("p")
  indivName.classList.add("individual")
  indivName.textContent = username
  let firstDiv = document.createElement("div")
  firstDiv.appendChild(indivName)

  let hashtag = document.createElement("p")
  hashtag.textContent = data["post"] + " #" + data["hashtag"]
  firstDiv.appendChild(hashtag)
  container.appendChild(firstDiv)

  indivName.addEventListener("click", userPost)
  return container
}

// TODO: Implement viewing a post when a user clicks on a post
function userPost() {
 console.log("TODO!");
}
/* Can use once auth.js or whatever for auth is setup
async function handleLogin() {
  try {
    await authLogin();
  } catch (error) {
    console.log("error!", error.message);
  }
} */