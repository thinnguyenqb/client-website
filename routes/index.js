var express = require('express');
var router = express.Router();
var homeControllers = require('../controllers/home-controllers');
var productControllers = require('../controllers/product-controllers');

/* GET home page. */
router.get('/', homeControllers.index);

// Store
router.get('/store', productControllers.displayProducts);

// Advance Filter
router.post('/store', productControllers.filter);

// Product Information
router.get('/product/:id', productControllers.productInfo);

//Search products
router.get('/search', productControllers.search);

// Post comment
router.post('/product/comment/:id', productControllers.comment);

// Add to cart
router.post('/product/add-to-cart/:id', productControllers.addToCart);

// Cart
router.get('/cart', productControllers.cart);

// Delete item from cart
router.post('/delete/:index', productControllers.delete);

module.exports = router;
