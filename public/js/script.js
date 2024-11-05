// Toggle reply box for a specific comment
function toggleReplyBox(postId, commentId) {
    const replyInputContainer = document.getElementById(`reply-input-${postId}-${commentId}`);
    replyInputContainer.style.display = replyInputContainer.style.display === 'none' ? 'block' : 'none';
}

// Submit a new comment
function submitComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value;

    if (commentText.trim() === "") {
        alert("Comment cannot be empty!");
        return;
    }

    fetch(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText, commentAuthor: "Anonymous" })
    })
    .then(response => response.json())
    .then(data => {
        commentInput.value = ''; // Reset input field

        const commentsList = document.getElementById(`comments-list-${postId}`);
        const newCommentItem = document.createElement('li');
        newCommentItem.innerHTML = `<strong>${data.commentAuthor}:</strong> ${data.commentText}
            <button class="reply-button" onclick="toggleReplyBox('${postId}', '${data.commentId}')">Reply</button>
            <div class="reply-input-container" id="reply-input-${postId}-${data.commentId}" style="display: none;">
                <input type="text" class="reply-input" placeholder="Your reply here...">
                <button class="submit-reply-button" onclick="submitReply('${postId}', '${data.commentId}')">Submit</button>
            </div>
            <ul class="reply-list" id="reply-list-${data.commentId}"></ul>`;
        commentsList.appendChild(newCommentItem);
    })
    .catch(error => console.error('Error:', error));
}

// Submit a reply to a comment
function submitReply(postId, commentId) {
    const replyInput = document.querySelector(`#reply-input-${postId}-${commentId} .reply-input`);
    const replyText = replyInput.value;

    if (replyText.trim() === "") {
        alert("Reply cannot be empty!");
        return;
    }

    fetch(`/posts/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText, replyAuthor: "Anonymous" })
    })
    .then(response => response.json())
    .then(data => {
        replyInput.value = ''; // Reset input field
        const replyList = document.getElementById(`reply-list-${commentId}`);
        const newReplyItem = document.createElement('li');
        newReplyItem.style.marginLeft = '20px';
        newReplyItem.style.fontStyle = 'italic';
        newReplyItem.innerHTML = `<strong>${data.replyAuthor}:</strong> ${data.replyText}`;
        replyList.appendChild(newReplyItem);
    })
    .catch(error => console.error('Error:', error));
}
