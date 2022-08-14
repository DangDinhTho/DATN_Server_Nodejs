const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var reviewProduct = new Schema({
    productId: String,
    content: String,
    star: Number,
    likes: Number,
    timeUpLoad: {
        type: Date,
        default: Date.now
    },
    imageURLs: {
        type: String,
        default: ''
    },
    owner: String
})


module.exports = mongoose.model('ReviewProduct', reviewProduct)
