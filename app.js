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

// Use this line to parse JSON request bodies
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/forumDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const replySchema = new mongoose.Schema({
    text: String,
    author: String,
}, { timestamps: true }); // To include createdAt field for replies

const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    replies: [replySchema] // Add replies as an array of replySchema
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [commentSchema]
}, { timestamps: true }); // This will add createdAt and updatedAt fields automatically

const Post = mongoose.model('Post', postSchema);

// Route to render homepage with all posts
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('home', { posts });
    } catch (err) {
        console.error(err);
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
        const savedPost = await newPost.save();
        res.redirect(`/posts/${savedPost._id}`); // Redirect to the new post
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
        author: req.body.commentAuthor || "Anonymous",
        replies: [] // Initialize replies as an empty array
    };

    try {
        const post = await Post.findById(postId);
        post.comments.push(newComment);
        await post.save();
        res.json({ commentAuthor: newComment.author, commentId: newComment._id });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving comment");
    }
});

// Route to handle reply submissions
app.post('/posts/:postId/comment/:commentId/reply', async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const newReply = {
        text: req.body.replyText,
        author: req.body.replyAuthor || "Anonymous"
    };

    try {
        const post = await Post.findById(postId);
        const comment = post.comments.id(commentId); // Find the comment by ID
        comment.replies.push(newReply); // Add the reply to the comment
        await post.save();
        res.json({ replyAuthor: newReply.author });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving reply");
    }
});



app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // Ensure you're using the correct model name
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post', { post: post });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving post");
    }
});


// Route to handle reply submissions
app.post('/posts/:postId/comments/:commentId/reply', async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const newReply = {
        text: req.body.replyText,
        author: req.body.replyAuthor || "Anonymous" // Set a default author
    };

    try {
        await Post.findByIdAndUpdate(postId, {
            $push: { 'comments.$[comment].replies': newReply }
        }, {
            arrayFilters: [{ 'comment._id': commentId }] // Filter to find the correct comment
        });
        res.redirect(`/posts/${postId}`); // Redirect back to the post page
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving reply");
    }
});

// Route to handle new comment submissions
// Route to handle comment submissions
app.post('/posts/:postId/comment', async (req, res) => {
    const postId = req.params.postId;
    const newComment = {
        text: req.body.commentText,
        author: req.body.commentAuthor || "Anonymous" // Set a default author
    };

    try {
        // Use findByIdAndUpdate to push the new comment into the comments array
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment }
        });
        res.status(200).json({ message: 'Comment added successfully' }); // Send success response
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving comment");
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://0.0.0.0:3000');
});
