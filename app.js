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
mongoose.connect('mongodb://localhost:27017/forumDB');

// Define a schema and model for forum posts
const postSchema = {
  title: String,
  content: String,
};
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

// Route to render form for new post creation
app.get('/new-post', (req, res) => {
  res.render('new-post');
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

// Start the server
app.listen(80, () => {
  console.log('Server is running on http://localhost:80');
});
