const express = require('express');
const router = express.Router();
let posts = []; // This would be your in-memory post storage

// Create a new post
router.post('/', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        content: req.body.content,
        timestamp: new Date(),
        comments: []
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Get all posts
router.get('/', (req, res) => {
    res.json(posts);
});

// Add a comment to a specific post
router.post('/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    const newComment = {
        id: post.comments.length + 1,
        content: req.body.content,
        timestamp: new Date()
    };
    post.comments.push(newComment);
    res.status(201).json(newComment);
});

module.exports = router;
