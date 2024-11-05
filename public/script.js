
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

function submitReply(postId, commentId, replyText = '', replyId = '') {
    const replyInput = document.querySelector(`#reply-input-${postId}-${commentId}${replyId ? '-' + replyId : ''} .reply-input`);
    const text = replyInput.value || replyText;

    if (text.trim() === "") {
        alert("Reply cannot be empty!");
        return;
    }

    fetch(`/posts/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            replyText: text,
            replyAuthor: "Anonymous"
        }),
    })
    .then(response => response.json())
    .then(data => {
        replyInput.value = ''; // Reset input field

        const replyList = document.querySelector(`#reply-list-${replyId ? replyId : commentId}`);
        const newReplyItem = document.createElement('li');
        newReplyItem.className = "reply";
        newReplyItem.innerHTML = `
            <strong>${data.replyAuthor}:</strong> <em>${data.replyText}</em>
            <button class="reply-button" onclick="toggleReplyBox('${postId}', '${commentId}', '${data.replyId}')">Reply</button>
            <div class="reply-input-container" id="reply-input-${postId}-${commentId}-${data.replyId}" style="display: none;">
                <input type="text" class="reply-input" placeholder="Your reply here...">
                <button class="submit-reply-button" onclick="submitReply('${postId}', '${commentId}', '', '${data.replyId}')">Submit</button>
            </div>`;
        
        replyList.appendChild(newReplyItem);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}