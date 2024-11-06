const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Post = require('./public/js/Post'); // Import the Post model

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // To parse form data

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set the directory for views (optional, but good practice)
app.set('views', path.join(__dirname, 'views'));

// Set up mongoose connection (replace with your MongoDB URI if using MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/forumDB');

// PAGES vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

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
// PAGES ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Route to get the forum page with posts
app.get('/forum', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });  // Get posts sorted by date
        res.render('forum', { title: 'Forum', posts: posts });
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
});

// Route to view an individual post by ID
app.get('/forum/:id', async (req, res) => {
    try {
        // Retrieve the post ID from the URL parameter
        const postId = req.params.id;

        // Find the post in the database by ID
        const post = await Post.findById(postId);

        // If the post does not exist, send a 404 error
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Render a new page for the individual post, passing the post data
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

        // Find the post and add the comment to its comments array
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Add the comment to the post's comments array
        post.comments.push({ author, content, createdAt: new Date() });
        
        // Save the updated post
        await post.save();

        // Redirect back to the individual post page
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
        await post.save();  // Save the post to the database
        res.redirect('/forum');  // Redirect to the forum page to see the new post
    } catch (err) {
        res.status(500).send('Error saving post');
    }
});


// Sample data (in-memory posts and comments)
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post on the forum!', comments: [] },
    { id: 2, title: 'Second Post', content: 'Here is the second post, let’s discuss!', comments: [] }
];

// Route to handle creating a new post
app.post('/forum', (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: posts.length + 1, title, content, comments: [] };
    posts.push(newPost);  // Add the new post to the posts array
    res.redirect('/forum');  // Redirect to the forum page to see the new post
});

// Route to handle posting a comment on a specific post
app.post('/forum/:postId/comment', (req, res) => {
    const postId = parseInt(req.params.postId);
    const { comment } = req.body;

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push(comment);  // Add the comment to the post
    }

    res.redirect('/forum');  // Redirect back to the forum page
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});