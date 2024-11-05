const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Set up body-parser for form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the public directory for static files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/forumDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Define schemas and models for posts and comments
const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [commentSchema] // Add comments as an array of commentSchema
});

const Post = mongoose.model('Post', postSchema);

// Homepage route with async/await for retrieving posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('home', { posts: posts });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving posts");
    }
});

// Route to handle new post submissions
app.post('/new-post', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
    });

    try {
        await newPost.save();
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving post");
    }
});

// Route to handle comment submissions
app.post('/posts/:postId/comment', async (req, res) => {
    const postId = req.params.postId;
    const newComment = {
        text: req.body.commentText,
        author: req.body.commentAuthor || "Anonymous" // Set a default author
    };

    try {
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment }
        });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving comment");
    }
});

// Route to render individual post details
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Message.findById(req.params.id); // Use your model name
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post', { post: post });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving post");
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://0.0.0.0:3000');
});
