
function submitComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value;

    if (commentText.trim() === "") {
        alert("Comment cannot be empty!");
        return;
    }

    fetch(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            commentText: commentText,
            commentAuthor: "Anonymous"
        }),
    })
    .then(response => response.json())
    .then(data => {
        commentInput.value = ''; // Reset input field
        
        const commentsList = document.getElementById(`comments-list-${postId}`);
        const newCommentItem = document.createElement('li');
        newCommentItem.className = "comment";
        newCommentItem.innerHTML = `
            <div class="comment-body">
                <strong>${data.commentAuthor}:</strong> ${data.commentText}
                <button class="reply-button" onclick="toggleReplyBox('${postId}', '${data.commentId}')">Reply</button>
            </div>
            <div class="reply-input-container" id="reply-input-${postId}-${data.commentId}" style="display: none;">
                <input type="text" class="reply-input" placeholder="Your reply here...">
                <button class="submit-reply-button" onclick="submitReply('${postId}', '${data.commentId}')">Submit</button>
            </div>
            <ul class="reply-list" id="reply-list-${data.commentId}"></ul>`;
        commentsList.appendChild(newCommentItem);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function toggleReplyBox(postId, commentId, replyId = '') {
    const replyInputContainer = document.getElementById(`reply-input-${postId}-${commentId}${replyId ? '-' + replyId : ''}`);
    replyInputContainer.style.display = replyInputContainer.style.display === 'none' ? 'block' : 'none';
}

function submitReply(postId, commentId) {
    const replyInput = document.querySelector(`#reply-input-${postId}-${commentId} .reply-input`);
    const replyText = replyInput.value;

    if (replyText.trim() === "") {
        alert("Reply cannot be empty!");
        return;
    }

    fetch(`/posts/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            replyText: replyText,
            replyAuthor: "Anonymous"
        }),
    })
    .then(response => response.json())
    .then(data => {
        replyInput.value = ''; // Reset input field

        // Wait for a small delay before trying to append the reply
        setTimeout(() => {
            const replyList = document.querySelector(`#reply-list-${commentId}`);
            if (replyList) {
                const newReplyItem = document.createElement('li');
                newReplyItem.innerHTML = `<strong>${data.replyAuthor}:</strong> ${data.replyText}`;
                replyList.appendChild(newReplyItem);
            } else {
                console.error(`Reply list not found for comment ${commentId}`);
            }
        }, 100); // 100ms delay before trying to append the reply
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
