window.addEventListener("load", init);

function init() {
  allPost();
  qs("#search-term").addEventListener("input", searchBar);
  document.getElementById("home-btn").addEventListener("click", homeButton);
  document.getElementById("post-btn").addEventListener("click", newYip);
}

async function allPost() {
  document.getElementById("description").innerText = "Loading..."
  let postsJson = await fetchJSON(`api/posts`)

  for (let i = 0; i < postsJson.length; i++) {
    let specificData =postsJson["posts"][i]
    let container = postCard(specificData)
    document.getElementById("home").appendChild(container)
  }
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
