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

let submittedTexts = []; // Array to store submitted texts

// Home route
app.get('/', (req, res) => {
    res.render('index', { submittedTexts: submittedTexts });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const submittedText = req.body.text; // Get the submitted text
    submittedTexts.push(submittedText); // Add it to the array
    res.redirect('/'); // Redirect to home page to see the new text
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:3000`);
});
