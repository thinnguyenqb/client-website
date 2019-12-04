var express = require('express');
var router = express.Router();
var Product = require('./../db/model/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({})
        .then(products => {
            res.render('pages/index', { products: products, user: req.user });
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
            res.render('pages/store', { products: products, name: 'Tất cả', user: req.user });
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
            res.render('pages/product', { product: product, user: req.user });
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
            res.render('pages/store', { products: products, name: req.params.category, user: req.user });
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
            res.render('pages/store', { products: products, name: req.params.producer, user: req.user });
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

module.exports = router;
