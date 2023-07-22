
/////////////////////////////////
// import dependencies
/////////////////////////////////
const mongoose = require('./connection')

// here's an alternate syntax for creating a schema
// reminder: we do not need a model for a subdocument
// all we need is a schema 
const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true
    },
    date: {type: String, required: false},
    username: { 
        type: String, 
        required: false
    },
}, {
    timestamps: true
})

module.exports = commentSchema