const express = require('express');
const app = express();

// Route to handle the homepage (root /)
app.get('/', (req, res) => {
    res.send('Welcome to my site!');
});

// Route for your existing posts functionality
app.use('/api/posts', require('./routes/posts'));

// Listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
