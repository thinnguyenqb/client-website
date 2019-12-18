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

//Search a product 
router.get('/search', productControllers.search);
module.exports = router;
