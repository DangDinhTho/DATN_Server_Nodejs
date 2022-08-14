var Product = require('../models/product')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const user = require('../models/user')
const product = require('../models/product')
const { use } = require('../routers')
const { Double } = require('mongodb')
const ReviewProduct = require('../models/review_product')


var functions = {

  addNew: function (req, res) {

    //console.log(req.file);

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      var token = req.headers.authorization.split(' ')[1]
      var decodedtoken = jwt.decode(token, config.secret)

      if ((!req.body.name) || (!req.body.price)) {
        res.json({ success: false, msg: 'Enter all fields' })
      }
      else {
        var newProduct = Product({
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price),
          thongSo: req.body.thongSo,
          category: req.body.category
          //imageURLs: [req.file.path]
        });

        newProduct.save(function (err, newProduct) {
          if (err) {
            res.json({ success: false, msg: 'Failed to save' })
          }
          else {
            //return res.json({success: true, msg: 'Successfully saved'});
            user.updateOne({ name: decodedtoken.name }, { $push: { library: newProduct._id } }, (err, data) => {
              if (err) throw err;
              else return res.json({ newBook: newProduct, success: true });
            });
          }
        })
      }

    }
    else {
      return res.json({ success: false, msg: 'No Headers' })
    }
  },


  addNewTool: function (req, res) {

    //console.log(req.file);

   
      if ((!req.body.name) || (!req.body.price)) {
        res.json({ success: false, msg: 'Enter all fields' })
      }
      else {
        var newProduct = Product({
          productId: req.body.productId,
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price),
          thongSo: req.body.thongSo,
          category: req.body.category,
          star: 0,
          reviewCount: 0,
          priceSale: Number(req.body.priceSale),
          imageURLs: req.body.imageURLs,
          colors: req.body.colors
          //imageURLs: [req.file.path]
        });

        newProduct.save(function (err, newProduct) {
          if (err) {
            res.json({ success: false, msg: 'Failed to save' })
          }
          else {
            return res.json({ newProduct: newProduct, success: true });
          }
        })
      }

    



  },

  getAllProducts: function (req, res) {
    product.find({}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  },

  getProductSearch: function (req, res) {
    product.find({ name: { $regex: req.body.keyWord, "$options": "i" } }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  },

  getProductsWithCategory: function (req, res) {
    product.find({ category: req.body.category }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  },


  getProductById: function (req, res) {
    Product.findOne({
      _id: req.body._id
  }, function (err, product) {
      if(err) throw err;
      else{
          return res.json(product)
      }
  })
  },


  getProductDetail: function (req, res) {

    var product;
    Product.findOne({_id: req.body._id}, function (err, product) {
      if(err) throw err;
      else{
        
        ReviewProduct.find({productId: req.body._id}, function(err, reviews){
          if(err) throw err;
          else{
            return res.json({product: product,  reviews: reviews})
          }
        })
        .limit(2);

          
      }
  })
  },

  get5Products: function (req, res) {
    Product.find({ }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    }).limit(5);
  },


  getProductsWithFilter: function (req, res) {

    var minPrice = 0;
    var maxPrice = Infinity;
    switch(req.body.priceFilter){
      case 1:
        maxPrice = 1000000;
        break;
        case 2:
          minPrice = 1000000;
        maxPrice = 5000000;
        break;
        case 3:
          minPrice = 5000000;
        maxPrice = 20000000;
        break;
        case 4:
          minPrice = 20000000;
        maxPrice = 100000000;
        break;
        case 5:
          minPrice = 100000000;
        break;
    }

    if(req.body.category == 0){
    product.find({price: { $lt: maxPrice, $gte: minPrice }}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
  else{
    product.find({category: req.body.category, price: { $lt: maxPrice, $gte: minPrice }}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
  },

}

module.exports = functions;