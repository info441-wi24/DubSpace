async function init() {
    await loadIdentity();
    await loadUserInfo();
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
    document.getElementById("chat-btn").addEventListener("click", async function () {
        try {
          const identityResponse = await fetch('api/users/myIdentity');
          const identityInfo = await identityResponse.json();

          if (identityInfo.status === "loggedin") {
            window.location.href = 'chat.html';
          } else {
            alert("Must be logged in to chat!")
          }
        } catch (error) {
          console.error("logging in", error)
        }
      });
}

async function saveUserInfo() {
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
}

async function loadUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (username == myIdentity) {
        document.getElementById("username-span").innerText = `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
    } else {
        document.getElementById("username-span").innerText = username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    //TODO: do an ajax call to load whatever info you want about the user from the user table

    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username) {
    document.getElementById("user-posts-loading").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/posts?username=${encodeURIComponent(username)}`);
    for (let i = 0; i < postsJson.length; i++) {
        let specificData = postsJson[i];
        let container = await postCard(specificData);
        document.getElementById("posts_box").appendChild(container);
    }
    document.getElementById("user-posts-loading").innerText = "";
}


async function deletePost(postID) {
    let responseJson = await fetchJSON(`api/posts`, {
        method: "DELETE",
        body: { postID: postID }
    })
    loadUserInfo();
}

async function searchBar(event) {
    let search = event.target.value.trim()
    if (search === "") {
        document.getElementById("search-btn").disabled = true
    } else {
        document.getElementById("search-btn").disabled = false
        document.getElementById("search-btn").addEventListener("click", searchPost)
    }
}

async function searchPost() {
    sessionStorage.setItem('searchQuery', document.getElementById("search-term").value)
    window.location.href = '/';
}

async function homeButton() {
    window.location.href = '/';
}

async function tagSearch(event) {
    sessionStorage.setItem('selectedTag', event.target.textContent.substring(1));
    window.location.href = '/';
}



async function postCard(data) {
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

function userPost() {
    console.log("TODO!");
   }