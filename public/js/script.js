// Fetch all posts and display them
async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <p>${post.content}</p>
            <small>${new Date(post.timestamp).toLocaleString()}</small>
            <div class="comments">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <p>${comment.content}</p>
                        <small>${new Date(comment.timestamp).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
            <textarea placeholder="Add a comment..." onkeypress="handleCommentInput(event, ${post.id})"></textarea>
        `;
        postsContainer.appendChild(postDiv);
    });
}

// Create a new post
async function createPost() {
    const content = document.getElementById('postContent').value;
    if (!content) return alert('Post content cannot be empty');

    await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    document.getElementById('postContent').value = '';
    fetchPosts(); // Refresh posts list
}

// Add a comment to a specific post
async function addComment(postId, content) {
    await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    fetchPosts(); // Refresh posts list
}

// Handle comment input
function handleCommentInput(event, postId) {
    if (event.key === 'Enter') {
        const content = event.target.value;
        if (content) {
            addComment(postId, content);
            event.target.value = ''; // Clear comment input
        }
    }
}

// Initial fetch
fetchPosts();
