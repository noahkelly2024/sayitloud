const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema with a comments field
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // New comments field as an array of objects
    comments: [
        {
            author: { type: String, required: false },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);
