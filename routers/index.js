const express = require('express');
const actions = require('../methods/actions')
const productActions = require('../methods/product_actions')
const bill_action = require('../methods/bill_action')
// const review = require('../methods/review_actions')

 const multer = require('multer');
const reviewProductAction = require('../methods/review_product_action');
// //const review = require('../models/review');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, "H" + Date.now() + file.originalname);
    }
});

var upload = multer({storage: storage});

const router = express.Router();

router.get('/', (req, res) => {
   res.send('Hello');
});

router.use('/uploads', express.static("uploads"));
router.use('/assetbundles', express.static("assetbundles"));
router.post('/user/signup', actions.addNew);
router.post('/user/authenticate', actions.authenticate);
router.get('/user/getInfo', actions.getinfo);
router.post('/user/addToCart', actions.addToCart);
router.post('/user/removeItemInCart', actions.removeItemInCart);
router.post('/user/checkout', bill_action.addNew);

router.post('/product/addNew', upload.single('image'), productActions.addNew);
router.post('/product/addNewTool', productActions.addNewTool);
router.get('/product/getAllProducts', productActions.getAllProducts);
// router.post('/product/withAuthor', productActions.getBookWithAuthor);
router.post('/product/withCategory', productActions.getProductsWithCategory);
router.post('/product/getById', productActions.getProductById);
router.post('/product/search', productActions.getProductSearch);
router.get('/product/get5Products', productActions.get5Products);
router.post('/product/filter', productActions.getProductsWithFilter);


router.post('/review/addNew', upload.single('image'), reviewProductAction.addNew);
router.post('/review/get2Review', reviewProductAction.get2Review);
router.post('/review/getReviews', reviewProductAction.getReviews);
router.get('/review/get5Review', reviewProductAction.get5Review);
// router.post('/post/like', review.likePost);
// router.post('post/comment', review.commentPost);

router.post('/bill/getBill', bill_action.getBill);

module.exports = router;