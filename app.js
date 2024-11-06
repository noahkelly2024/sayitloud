const express = require('express');
const app = express();
app.use(express.json());

// In-memory storage (or use a database like MongoDB in production)
let posts = [];

// Basic routes setup (you’ll define these routes in detail below)
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));