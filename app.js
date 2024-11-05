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

// Default HTTP port; you can change this if needed
const PORT = process.env.PORT || 80; 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/forumDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model for forum posts
const postSchema = {
  title: String,
  content: String,
};
const Post = mongoose.model('Post', postSchema);

// Serve static files from the "public" directory (create this folder)
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES vvv

// Display a form for adding a new post
app.get('/new-post', (req, res) => {
    res.render('new-post');
  });

// Render the homepage
app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
      if (!err) {
        res.render('home', { posts: posts });
      } else {
        console.log(err);
      }
    });
  });

// Handle the form submission and save the new post to the database
app.post('/new-post', (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
    });
  
    newPost.save((err) => {
      if (!err) {
        res.redirect('/');
      } else {
        console.log(err);
      }
    });
  });

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Change to your main HTML file
  });
  

// ROUTES ^^^

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });

// Start the server and listen on the specified port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });






