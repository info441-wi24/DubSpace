// import { login as authLogin } from './auth.js'; Needa set up auth.js

//window.addEventListener("load", init);

async function init() {
  await loadIdentity();
  allPost();
  document.querySelector("#search-term").addEventListener("input", searchBar);
  document.getElementById("home-btn").addEventListener("click", homeButton);
  document.getElementById("post-btn").addEventListener("click", postCard);
}

async function allPost() {
  document.getElementById("description").innerText = "Loading...";
  try {
    // Can use fetchJSON, need to import it from utils
      let response = await fetch(`api/posts`);
      let postsJson = await response.json();

      for (let i = 0; i < postsJson.length; i++) {
          let specificData = postsJson[i];
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
  //debug
  if (!data["post"]) {
    data["post"] = "No post available";
  }
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
/* old code (using function in identity.js instead)
async function handleLogin() {
  try {
    await authLogin();
  } catch (error) {
    console.log("error!", error.message);
  }
} */