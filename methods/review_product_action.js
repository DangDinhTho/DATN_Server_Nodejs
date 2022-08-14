var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const user = require('../models/user')
const reviewProduct = require('../models/review_product')
const Product = require('../models/product')

var functions = {

    addNew: function (req, res) {

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)

            if ((!req.body.star)) {
                res.json({ success: false, msg: 'Enter all fields' })
            }
            else {
                var newReview = reviewProduct({
                    star: req.body.star,
                    productId: req.body.productId,
                    content: req.body.content,
                    imageURL: req.body.path,
                    owner: decodedtoken.name
                });
                newReview.save(function (err, newReview) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to save' })
                    }
                    else {

                        Product.findById({_id: req.body.productId }, function (err, product) {
                            if (err) {
                                console.log(err);
                            } else {
                                var star = (product.star * product.reviewCount + req.body.star) / (product.reviewCount + 1);
                                var reviewC = product.reviewCount + 1;
                                Product.updateOne({ _id: req.body.productId },{$set: { reviewCount: reviewC, star: star}}, (err, data) => {
                                    if (err) throw err;
                                    else return res.json({ success: true, msg: 'Successfully saved' });
                                });
                                //return res.json({ success: true, msg: 'Successfully saved' });
                            }
                        })
                        //return res.json({success: true, msg: 'Successfully saved'});
                        
                    }
                })
            }

        }
        else {
            return res.json({ success: false, msg: 'No Headers' })
        }
    },


    get2Review: function (req, res) {
        reviewProduct.find({productId: req.body._id }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }).limit(2);
    },

    getReviews: function (req, res) {
        reviewProduct.find({productId: req.body._id }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        });
    },

    get5Review: function (req, res) {
        reviewProduct.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json(result);
            }
        }).limit(5);
    },


}

module.exports = functions;