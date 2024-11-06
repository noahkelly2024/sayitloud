const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./public/js/Post');  // Import the Post model

// Initialize the express app
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json());  // To parse JSON data

// Serve static files like CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/forumDB', {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

// Home page route
app.get('/', (req, res) => {
    res.render('home');  // Render home.ejs
});

// About page route
app.get('/about', (req, res) => {
    res.render('about');  // Render about.ejs
});

// Forum page route
app.get('/forum', async (req, res) => {
    try {
        // Fetch all posts from the database, sorted by creation date
        const posts = await Post.find().sort({ createdAt: -1 });
        
        // Render the forum page and pass the posts data to the view
        res.render('forum', { title: 'Forum', posts: posts });
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
});

// Route to view an individual post by ID
app.get('/forum/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post', { title: post.title, post: post });
    } catch (err) {
        res.status(500).send('Error retrieving post');
    }
});

// Route to add a comment to a post
app.post('/forum/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;
        const { author, content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        post.comments.push({ author, content, createdAt: new Date() });
        await post.save();
        res.redirect(`/forum/${postId}`);
    } catch (err) {
        res.status(500).send('Error adding comment');
    }
});

// Route to handle creating a new post
app.post('/forum/create-post', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });

    try {
        await post.save();
        res.redirect('/forum');
    } catch (err) {
        res.status(500).send('Error saving post');
    }
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
