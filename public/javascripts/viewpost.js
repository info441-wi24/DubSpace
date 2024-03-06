document.addEventListener("DOMContentLoaded", init);

// Initializing home button
async function init() {
    document.getElementById("home-btn").addEventListener("click", function() {
        window.location.href = '/';
    });
}

// Loads individual post being viewed
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postID = urlParams.get('id');
    // Only if postID is valid
    if (postID) {
        try {
            const postResponse = await fetch(`api/posts/${postID}`);
            const postData = await postResponse.json();
            // Displaying title, content and tags
            document.getElementById('post-title').textContent = postData.title;
            document.getElementById('post-content').textContent = postData.post;
            let hashtagStr = "";
            postData.hashtag.forEach((hashtag) => hashtagStr += "#" + hashtag + " ");
            document.getElementById('hashtags').textContent = hashtagStr;

            let formattedDate = formatDate(postData.created_date);
            let userInfo = `Posted by <a href="/userInfo.html?user=${encodeURIComponent(postData.username)}">${postData.username}</a> on ${formattedDate}`;
            document.getElementById('authorinfo').innerHTML = userInfo;
            await fetchComments(postID);
            const identityResponse = await fetch('api/users/myIdentity');
            const identityInfo = await identityResponse.json();
            // Only allow logged in users to add comments
            if (identityInfo.status === "loggedin") {
                document.getElementById('comment-form').style.display = "block";
                document.getElementById('CommentDisplay').textContent = "Comments:"
            } else {
                // Else display message telling users to login
                document.getElementById('CommentDisplay').textContent = "Login to add and view comments!"
                document.getElementById('comment-form').style.display = "none";
            }
            // Error handling
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    } else {
        console.error("No post ID provided in the query parameters.");
    }
    // Fetching all comments and posting new comments
    document.getElementById('comment-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const postID = urlParams.get('id');
        const newComment = document.getElementById('comment-content').value;

        try {
            const response = await fetch('api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ postID, newComment })
            });
            // Error handling for serverside response errors
            if (response.ok) {
                const commentData = await response.json();
                updateCommentSection(commentData.comment);
                document.getElementById('comment-content').value = '';
            } else {
                console.error('Failed to add comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    });
});

// Fetch comments associated with post
async function fetchComments(postID) {
    try {
        const response = await fetch(`api/comments/?postID=${postID}`);
        const commentsData = await response.json();
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        commentsData.forEach(comment => {
            const commentItem = document.createElement('li');
            let formattedDate = formatDate(comment.created_date);
            commentItem.innerHTML = `${comment.username}: ${comment.comment} <br> Posted on ${formattedDate}`;
            commentsList.appendChild(commentItem);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Helper function to check if user if properly logged in and authenticated
async function checkLoginStatus() {
    try {
        const response = await fetch('api/users/myIdentity');
        const data = await response.json();
        return data.status === "loggedin";
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
}

// Function that updatesCommentSection when a new commment is added
function updateCommentSection(commentData) {
    const commentsContainer = document.getElementById('comments-section');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    const commentHTML = `
        <div class="comment-info">
            <span class="comment-author">${commentData.username}</span>
            <span class="comment-date">${formatDate(commentData.created_date)}</span>
        </div>
        <div class="comment-text">${commentData.comment}</div>
    `;

    commentElement.innerHTML = commentHTML;
    commentsContainer.appendChild(commentElement);
    window.location.reload();
}

// formatDate helper function
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('en-US', options);
}