/**
* ███████╗███████╗████████╗██╗   ██╗██████╗ 
* ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
* ███████╗█████╗     ██║   ██║   ██║██████╔╝
* ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
* ███████║███████╗   ██║   ╚██████╔╝██║     
* ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
*/

const express = require('express');
const session = require('express-session');
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

/**
* ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
* ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
* ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
* ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
* ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
* ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
*/
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

/**
*  █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
* ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
* ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
* ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
* ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
* ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝
*/
// Set up session middleware
app.use(session({
    secret: 'yourSecretKey', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false
}));

// Middleware for checking if the user is authenticated as admin
const adminAuth = (req, res, next) => {
    if (req.session.isAdmin) {
        next(); // User is authenticated as admin
    } else {
        res.redirect('/admin/login'); // Redirect to login if not authenticated
    }
};

// Handle admin login
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = 'admin'; // Replace with a secure username
    const adminPassword = 'admin'; // Replace with a secure password
    
    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true; // Set session variable
        res.redirect('/admin'); // Redirect to admin dashboard
    } else {
        res.send('Invalid credentials'); // Error message for wrong login
    }
});

// Admin Dashboard - only accessible if logged in
app.get('/admin', adminAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('admin', { title: 'Admin Dashboard', posts });
    } catch (err) {
        res.status(500).send('Error fetching posts for admin');
    }
});

// Logout Route for Admin
app.post('/admin/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/admin/login'); // Redirect to login page
});

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

/**
* ███████╗████████╗ █████╗ ██████╗ ████████╗
* ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
* ███████╗   ██║   ███████║██████╔╝   ██║   
* ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
* ███████║   ██║   ██║  ██║██║  ██║   ██║   
* ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
*/
// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});