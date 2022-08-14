var ReviewPost = require('../models/review')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const user = require('../models/user')
const review_product = require('../models/review_product')


var functions = {

addNew: function (req, res) {
    
    //console.log(req.file);
    
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var token = req.headers.authorization.split(' ')[1]
        var decodedtoken = jwt.decode(token, config.secret)

        if ((!req.body.title) || (!req.body.subtitle)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newReview = ReviewPost({
                content: req.body.content,
                imageURLs: [req.file.path],
                owner: decodedtoken.name
            });
            newReview.save(function (err, newReview) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    //return res.json({success: true, msg: 'Successfully saved'});
                    user.updateOne({name: decodedtoken.name}, {$push: {posts: newReview._id}}, (err, data) => {
                        if(err) throw err;
                        else return res.json({success: true, msg: 'Successfully saved'});
                    });
                }
            })
        }
       
    }
    else {
        return res.json({success: false, msg: 'No Headers'})
    }
},

getAllPosts: function(req, res){
    ReviewPost.find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
},

getPost: function(req, res){
    ReviewPost.findById({_id: req.body._id}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      });
},

likePost: function(req, res){
    ReviewPost.updateOne({_id: req.body._id}, {$push: {likes: req.body.name}}, (err, data) => {
        if(err) throw err;
        else return res.json({success: true, msg: 'Successfully saved'});
    });
},


commentPost: function(req, res){

    var newComment = {
        owner: req.body.owner,
        content: req.body.content
    }
    ReviewPost.updateOne({_id: req.body._id}, {$push: {comments: newComment}}, (err, data) => {
        if(err) throw err;
        else return res.json({success: true, msg: 'Successfully saved'});
    });
},




}

module.exports = functions;