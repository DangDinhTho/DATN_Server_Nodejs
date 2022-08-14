var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const user = require('../models/user')
const reviewProduct = require('../models/review_product')
const Product = require('../models/product')
const Bill = require('../models/Bill')
const { all } = require('../routers')

var functions = {

    addNew: function (req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)

            if ((!req.body)) {
                res.json({ success: false, msg: 'Enter all fields' })
            }
            else {

                user.findById({ _id: req.body._id }, function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        var cart = user.cart;
                        if (!cart || cart.items.Length == 0) return;

                        var bill = Bill({
                            owner: req.body._id,
                            name: req.body.name,
                            phoneNumber: req.body.phoneNumber,
                            address: req.body.address,
                            price: req.body.price,
                            cart: user.cart,
                            status: 0

                        });
                        bill.save(function (err, result) {
                            if (err) {
                                res.json({ success: false, msg: 'Failed to save' })
                            }
                            else {
                                user.cart = undefined;
                                user.save();
                                // user.update({_id: req.body._id}, { $unset : { cart : 1} }, (err, data) => {
                                //     if (err) throw err;
                                //else 
                                return res.json({ success: true, msg: 'Successfully saved' });
                                // });
                                //return res.json({success: true, msg: 'Successfully saved'});

                            }
                        })

                    }
                })



            }

        }
        else {
            return res.json({ success: false, msg: 'No Headers' })
        }
    },



    getBill: function (req, res) {
        Bill.find({ owner: req.body._id }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        });
    }


}

module.exports = functions;