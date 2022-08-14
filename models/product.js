const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = []

var product = new Schema({
    productId: String,
    name: String,
    description: String,
    star: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    thongSo: {
        dai: Number,
        rong: Number,
        cao: Number,
        vatLieu: String
    },
    category: String,
    time_up_load: {
        type: Date,
        default: Date.now
    },
    price: Number,
    priceSale: Number,
    imageURLs: {
        type: [String],
        default: ['']
    },
    colors: {
        type: [String],
        default: ["Mặc định"]
    }
})


module.exports = mongoose.model('Product', product)
