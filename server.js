const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Post = require('./public/js/Post'); // Import the Post model

// Middleware for checking if the user is authenticated as admin
const adminAuth = (req, res, next) => {
    const { username, password } = req.body;
    const adminUsername = 'admin'; // Replace with secure credentials in a real app
    const adminPassword = 'password123'; // Replace with secure credentials in a real app
    
    if (username === adminUsername && password === adminPassword) {
        next();  // Continue to the admin route if authenticated
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/forumDB');

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set the directory for views (optional, but good practice)
app.set('views', path.join(__dirname, 'views'));

// Route for the Admin Dashboard
app.get('/admin', adminAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts
        res.render('admin', { title: 'Admin Dashboard', posts });
    } catch (err) {
        res.status(500).send('Error fetching posts for admin');
    }
});

// Other routes and code continue below...
// Route to delete a post by ID
app.post('/admin/delete-post/:id', adminAuth, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id); // Delete the post
        res.redirect('/admin'); // Redirect back to the admin dashboard
    } catch (err) {
        res.status(500).send('Error deleting post');
    }
});

// Route to delete a comment from a post
app.post('/admin/delete-comment/:postId/:commentId', adminAuth, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        
        if (post) {
            post.comments.id(commentId).remove(); // Remove the comment
            await post.save(); // Save the post
            res.redirect('/admin'); // Redirect to the admin dashboard
        } else {
            res.status(404).send('Post not found');
        }
    } catch (err) {
        res.status(500).send('Error deleting comment');
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
