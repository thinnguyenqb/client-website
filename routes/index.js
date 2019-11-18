var express = require('express');
var router = express.Router();
var Product = require('./../db/model/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({})
        .then(products => {
            res.render('index', { products: products })
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
            res.render('store', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Sample Product (AC)
router.get('/sample-product/:name', function(req, res, next) {
  Product.findOne({ name: req.params.name })
        .then(product => {
            res.render('sample-product', { product: product })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Categories
router.get('/action', function(req, res, next) {
  Product.find({ category: "Hành động" })
        .then(products => {
            res.render('store', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

router.get('/horror', function(req, res, next) {
  Product.find({ category: "Kinh dị" })
        .then(products => {
            res.render('store', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

router.get('/rpg', function(req, res, next) {
  Product.find({ category: "Phiêu lưu" })
        .then(products => {
            res.render('store', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

router.get('/strategy', function(req, res, next) {
  Product.find({ category: "Chiến thuật" })
        .then(products => {
            res.render('store', { products: products })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
});

// Account
router.get('/login', function(req, res, next) {
  res.render('account/login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('account/register', { title: 'Express' });
});

router.get('/forget-password', function(req, res, next) {
  res.render('account/forget-password', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
  res.render('account/profile', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { title: 'Express' });
});

module.exports = router;
