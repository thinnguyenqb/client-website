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
	// Validate query string
	const category = (typeof req.query.category != 'undefined')?(req.query.category):'';
	const producer = (typeof req.query.producer != 'undefined')?(req.query.producer):'';
	const count = (typeof req.query.count != 'undefined')?parseInt(req.query.count):12;
	const page = (typeof req.query.page != 'undefined')?parseInt(req.query.page):1;

	let params = {};
	let classifyStr = '';
	if (category != '') {
		params.category = category;
		classifyStr += ('category=' + category + '&');
	}
	if (producer != '') {
		params.producer = producer;
		classifyStr += ('producer=' + producer + '&');
	}
	console.log(params);

	Product.find(params)
		.then(allProducts => {
			Product.find(params).limit(count).skip((page - 1) * count).exec()
				.then(products => {
					res.render('pages/store', {
						user: req.user, // User
						products: products,
						name: ' ' + category + ' ' + producer,
						classifyStr: classifyStr,
						count: count,
						page: page,
						countPage: parseInt(allProducts.length / count +
							((allProducts.length % count == 0) ? 0 : 1)),
						countAll: allProducts.length,
						i: 1 // loop index for creating page index
					});
				})
				.catch(err => {
					console.log('Error: ', err);
					throw err;
				});
		})
		.catch(err => {
			console.log('Error: ', err);
			throw err;
		});
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

// // Categories
// router.get('/category/:category', function(req, res, next) {
// 	Product.find({ category: req.params.category })
// 		.then(products => {
// 			res.render('pages/store', { products: products, name: req.params.category, user: req.user });
// 		})
// 		.catch(err => {
// 			console.log('Error: ', err);
// 			throw err;
// 		})
// });

// // Producer
// router.get('/producer/:producer', function(req, res, next) {
//     Product.find({ producer: req.params.producer })
// 		.then(products => {
// 			res.render('pages/store', { products: products, name: req.params.producer, user: req.user });
// 		})
// 		.catch(err => {
// 			console.log('Error: ', err);
// 			throw err;
// 		})
// });

module.exports = router;
