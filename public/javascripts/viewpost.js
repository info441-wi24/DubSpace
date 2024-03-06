document.addEventListener("DOMContentLoaded", init);

async function init() {
    document.getElementById("home-btn").addEventListener("click", function() {
        window.location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postID = urlParams.get('id');

    if (postID) {
        try {
            const postResponse = await fetch(`api/posts/${postID}`);
            const postData = await postResponse.json();
            document.getElementById('post-title').textContent = postData.title;
            document.getElementById('post-content').textContent = postData.post;
            let hashtagStr = "";
            postData.hashtag.forEach((hashtag) => hashtagStr += "#" + hashtag + " ");
            document.getElementById('hashtags').textContent = hashtagStr;

            let tempTime = postData.created_date;
            let currDate = new Date(tempTime);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            let formattedDate = currDate.toLocaleDateString('en-US', options);
            let userInfo = `Posted by <a href="/userInfo.html?user=${encodeURIComponent(postData.username)}">${postData.username}</a> on ${formattedDate}`;
            document.getElementById('authorinfo').innerHTML = userInfo;
            await fetchComments(postID);
            const identityResponse = await fetch('api/users/myIdentity');
            const identityInfo = await identityResponse.json();
            if (identityInfo.status === "loggedin") {
                document.getElementById('comment-form').style.display = "block";
                document.getElementById('CommentDisplay').textContent = "Comments:"
            } else {
                document.getElementById('CommentDisplay').textContent = "Login to add and view comments!"
                document.getElementById('comment-form').style.display = "none";
            }

        } catch (error) {
            console.error("Error fetching post:", error);
        }
    } else {
        console.error("No post ID provided in the query parameters.");
    }

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

async function fetchComments(postID) {
    try {
        const response = await fetch(`api/comments/?postID=${postID}`);
        const commentsData = await response.json();
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        commentsData.forEach(comment => {
            const commentItem = document.createElement('li');

            let tempTime = comment.created_date;
            let currDate = new Date(tempTime);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            let formattedDate = currDate.toLocaleDateString('en-US', options);

            commentItem.innerHTML = `${comment.username}: ${comment.comment} <br> Posted on ${formattedDate}`;
            commentsList.appendChild(commentItem);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}


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