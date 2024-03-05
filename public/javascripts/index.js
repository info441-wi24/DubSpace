// import { login as authLogin } from './auth.js'; Needa set up auth.js

// window.addEventListener("load", init);

async function init() {
  await loadIdentity();
  allPost();
  document.querySelector("#search-term").addEventListener("input", searchBar);
  document.getElementById("home-btn").addEventListener("click", homeButton);
  document.getElementById("post-btn").addEventListener("click", async function () {
    try {
      const identityResponse = await fetch('api/users/myIdentity');
      const identityInfo = await identityResponse.json();

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

async function allPost() {
  document.getElementById("description").innerText = "Loading...";
  try {
    if (sessionStorage.getItem('selectedTag')) {
      tagSearch(sessionStorage.getItem('selectedTag'))
    } else {
      let response = await fetch(`api/posts`);
      let postsJson = await response.json();

      for (let i = 0; i < postsJson.length; i++) {
        let specificData = postsJson[i];
        let container = postCard(specificData);
        document.getElementById("home").appendChild(container);
      }
      document.getElementById("description").innerText = "Welcome!";
    } // takes out loading text after posts load
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
  }
}

function searchBar(event) {
  let search = event.target.value.trim()

  if (search === "") {
    document.getElementById("search-btn").disabled = true
  } else {
    document.getElementById("search-btn").disabled = false
    document.getElementById("search-btn").addEventListener("click", searchPost)
  }
}

async function searchPost() {
  document.getElementById("description").innerText = "Loading...";
  document.getElementById("home").classList.remove("hidden");
  let search = document.getElementById("search-term").value;

  try {
    let response = await fetch(`api/posts?search=${search}`);
    let postsJson = await response.json();
    document.getElementById("home").innerHTML = ""

    for (let i = 0; i < postsJson.length; i++) {
      let specificData = postsJson[i];
      let container = postCard(specificData);
      document.getElementById("home").appendChild(container);
    }
    document.getElementById("description").innerHTML = `Posts including: "${search}"`

  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
  }
}

async function tagSearch(event) {
  document.getElementById("description").innerText = "Loading...";
  let tag = sessionStorage.getItem('selectedTag') || event.target.textContent.substring(1);
  console.log(tag)

  try {
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

  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorResponse = document.getElementById('error');
    let errordesc = document.getElementById("description");
    errordesc.innerText = errorResponse;
    errordesc.classList.toggle('hidden');
    sessionStorage.removeItem('selectedTag');
  }
}

function homeButton() {
  window.location.href = '/';
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

  let extraInfo = document.createElement("p")
  extraInfo.classList.add("user-time")
  //debug
  if (!data["post"]) {
    data["post"] = "No post available";
  }
  let tempTime = data["created_date"];
  let currDate = new Date(tempTime);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  let formattedDate = currDate.toLocaleDateString('en-US', options)
  extraInfo.textContent = data["username"] + " posted on " + formattedDate;
  let postContent = document.createElement("p");
  let title = document.createElement("h1");
  title.textContent = data["title"];

  firstDiv.appendChild(title);
  postContent.textContent = data["post"];
  firstDiv.appendChild(postContent);

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
  let likeBtn = document.createElement("button");
  likeBtn.innerHTML = "&#x2764;";
  likeBtn.classList.add("like-btn");

  let likeCount = document.createElement("span");
  likeCount.textContent = data.likes.length + " Likes";
  likeCount.classList.add('like-count');

  firstDiv.appendChild(likeBtn);
  firstDiv.appendChild(likeCount);

  likeBtn.addEventListener("click", function () {
    let index = data["likes"].indexOf(username);
    if (index === -1) {
      data["likes"].push(username);
    } else {
      data["likes"].splice(index, 1);
    }
    likeCount.textContent = data.likes.length + " Likes";
  })
  firstDiv.appendChild(extraInfo)
  container.appendChild(firstDiv)

  indivName.addEventListener("click", userPost)
  return container
}

// TODO: Implement viewing a post when a user clicks on a post
function userPost() {
  console.log("TODO!");
}
