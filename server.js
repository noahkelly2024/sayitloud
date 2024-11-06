const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the directory for views (optional, but good practice)
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Home page route
app.get('/', (req, res) => {
    res.render('home');  // Render home.ejs
});

// About page route
app.get('/about', (req, res) => {
    res.render('about');  // Render about.ejs
});

// Forum page route
app.get('/forum', (req, res) => {
    res.render('forum');  // Render forum.ejs
});















// Listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
