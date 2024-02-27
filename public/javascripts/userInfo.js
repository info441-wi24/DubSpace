async function init(){
    await loadIdentity();
    loadUserInfo();
    document.querySelector("#search-term").addEventListener("input", searchBar);
    document.getElementById("home-btn").addEventListener("click", homeButton);
    document.getElementById("post-btn").addEventListener("click", postCard);
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    console.log(username)
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table

    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}

// TODO: Handle searchbar functions, currently just a dummy function to avoid error
function searchBar(event) {
    // Dummy implementation
    console.log("Search bar input:", event.target.value);
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

  let hashtag = document.createElement("p")
  let extraInfo = document.createElement("p")
  extraInfo.classList.add("user-time")
  //debug
  if (!data["post"]) {
    data["post"] = "No post available";
  }
  extraInfo.textContent = data["username"] + " posted on: " + data["created_date"];
  hashtag.textContent = data["post"] + " #" + data["hashtag"]
  firstDiv.appendChild(hashtag)
  firstDiv.appendChild(extraInfo)
  container.appendChild(firstDiv)

  indivName.addEventListener("click", userPost)
  return container
}