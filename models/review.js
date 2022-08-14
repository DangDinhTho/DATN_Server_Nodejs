const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var review = new Schema({
    content: String,
    likes: [String],
    comments: [{
       owner: String,
       content: String,
       time_comment: {
        type: Date,
        default: Date.now
    },
    }],
    time_up_load: {
        type: Date,
        default: Date.now
    },
    imageURLs: {
        type: [String],
        default: ['']
    },
    owner: String
})


module.exports = mongoose.model('Review', review)
