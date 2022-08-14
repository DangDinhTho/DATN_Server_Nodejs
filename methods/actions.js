var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { use } = require('../routers')


var functions = {
    addNew: function (req, res) {

        if ((!req.body) || (!req.body.name) || (!req.body.password)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                name: req.body.name,
                phone_number: req.body.phoneNumber,
                address:  req.body.address,
                password: req.body.password
    
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    newUser.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(newUser, config.secret);
                            newUser.password = "";
                            res.json({success: true, token: token, user: newUser})
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
            })
        }
    },
    authenticate: function (req, res) {
        User.findOne({
            phone_number: req.body.phoneNumber
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
                }

                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret)
                            user.password = "";
                            res.json({success: true, token: token, user: user})
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
        }
        )
    },

   

    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            //return res.json({success: true,  decodedtoken})
            User.findOne({
                name: decodedtoken.name
            }, function (err, user) {
                if(err) throw err;
                else{
                    return res.json({success: true, user: user})
                }
            })
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    },

    addToCart: function(req, res){

        var productInstan = {
            id: req.body.item.id,
            productId: req.body.item.productId,
            soLuong: req.body.item.soLuong,
            colorSelected: req.body.item.colorSelected,
            baoHanh: req.body.item.baoHanh
        }
        User.updateOne({_id: req.body._id}, {$push: {"cart.items": productInstan}}, (err, data) => {
            if(err) throw err;
            else return res.json({success: true, msg: productInstan.id});
        });
    },


    removeItemInCart: function(req, res){

        var id = req.body.id;
        User.updateOne({_id: req.body._id}, {$pull: {"cart.items": {id: id}}}, (err, data) => {
            if(err) throw err;
            else return res.json({success: true, msg: id});
        });
    }



}

module.exports = functions