const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Set up body-parser for form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the public directory for static files
app.use(express.static('public'));

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simpleTextAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for successful connection
mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB!");
});

// Define a schema and model for forum posts
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

// let submittedTexts = []; // Array to store submitted texts

// Home route
app.get('/', async (req, res) => {
    try {
      const messages = await Message.find({});
      res.render('index', { submittedTexts: messages });
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).send("Failed to load messages.");
    }
  });
  
// About page route
app.get('/about', (req, res) => {
    res.render('about'); // Render the 'about.ejs' view
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

// // Handle form submission
// app.post('/submit', async (req, res) => {
//     const messageContent = req.body.text;
  
//     // Create a new message instance and save it to the database
//     const newMessage = new Message({
//       content: messageContent,
//     });
  
//     try {
//       await newMessage.save();
//       res.redirect('/');
//     } catch (error) {
//       console.error("Error saving message:", error);
//       res.status(500).send("Failed to save message.");
//     }
//   });
  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:3000`);
});
