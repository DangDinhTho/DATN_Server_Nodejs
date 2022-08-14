const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var message = new Schema({
    userId: String,
    content: String,
    timeUpLoad: {
        type: Date,
        default: Date.now
    },
    imageURLs: {
        type: String,
        default: ''
    }
})


module.exports = mongoose.model('Message', message)