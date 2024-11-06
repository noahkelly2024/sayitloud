const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // To parse form data

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set the directory for views (optional, but good practice)
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// PAGES vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

// Home page route
app.get('/', (req, res) => {
    res.render('home');  // Render home.ejs
});

// About page route
app.get('/about', (req, res) => {
    res.render('about');  // Render about.ejs
});

// Route to render the forum page
app.get('/forum', (req, res) => {
    res.render('forum', { posts });  // Render the forum page with posts
});

// PAGES ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


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