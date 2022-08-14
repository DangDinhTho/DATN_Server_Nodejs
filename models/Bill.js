var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var order = new Schema({
    owner: String,
    name: {
        type: String,
        require: true
    },
    phoneNumber: String,
    address: String,
    cart: {
        items:
        [
           {
            id: Number,
            productId : String,
            soLuong : Number,
            colorSelected : Number,
            baoHanh : Number
           }
        ]
    },
    price: Number,
    status: Number,
    time: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Bill', order)