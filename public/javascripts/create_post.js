window.addEventListener("load", init);

function init() {
    document.getElementById("home-btn").addEventListener("click", function() {
        window.location.href = '/';
    });
    document.getElementById("post-form").addEventListener("submit", submitPost);
}

async function submitPost(event) {
    event.preventDefault();
    const postContent = document.getElementById("postContent").value;
    const hashtag = document.getElementById("hashtag").value;
    let identityInfo = await fetchJSON(`api/users/myIdentity`)
    const myIdentity = identityInfo.userInfo.username;
    try {
        const response = await fetch("api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: myIdentity,
                post: postContent,
                hashtag: hashtag
            })
        });
        if (!response.ok) {
            throw new Error("Could not create post");
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

init();