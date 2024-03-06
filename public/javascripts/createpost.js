document.addEventListener("DOMContentLoaded", init);

// Initializing page
async function init() {
    document.getElementById("home-btn").addEventListener("click", homeButton);
    document.getElementById("post-form").addEventListener("submit", submitPost);
}

// Brings user back to the home page
async function homeButton() {
    window.location.href = '/';
}

// Function that submits new post
async function submitPost(event) {
    event.preventDefault();
    // Get post content to display
    const postContent = document.getElementById("postContent").value;
    const hashtag = document.getElementById("hashtag").value;
    const titleContent = document.getElementById("title").value;
    let identityInfo = await fetchJSON(`api/users/myIdentity`)
    const myIdentity = identityInfo.userInfo.username;
    // Call to the users and posts router to make sure that the user is logged in, then allow them to post
    try {
        const response = await fetch("api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: myIdentity,
                post: postContent,
                hashtag: hashtag,
                title: titleContent
            })
        });
        if (!response.ok) {
            throw new Error("Could not create post");
        } else {
            window.location.href = '/';
        }
    // Error handling
    } catch (error) {
        console.error("Error creating post:", error);
    }
}
