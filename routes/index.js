var express = require('express');
var router = express.Router();
var Product = require('./../db/model/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({})
        .then(products => {
            res.render('pages/index', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Store
router.get('/store', function(req, res, next) {
  Product.find({})
        .then(products => {
            res.render('pages/store', { products: products, name: 'Tất cả'})
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Product Information
router.get('/product/:id', function(req, res, next) {
  Product.findOne({ _id: req.params.id })
        .then(product => {
            res.render('pages/product', { product: product })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Categories
router.get('/category/:category', function(req, res, next) {
  Product.find({ category: req.params.category })
        .then(products => {
            res.render('pages/store', { products: products, name: req.params.category})
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Producer
router.get('/producer/:producer', function(req, res, next) {
  Product.find({ producer: req.params.producer })
        .then(products => {
            res.render('pages/store', { products: products, name: req.params.producer})
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});


// Account
router.get('/login', function(req, res, next) {
  res.render('pages/account/login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('pages/account/register', { title: 'Express' });
});

router.get('/forget-password', function(req, res, next) {
  res.render('pages/account/forget-password', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
  res.render('pages/account/profile', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  res.render('pages/checkout', { title: 'Express' });
});

module.exports = router;
