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
		});
});

// Store
router.get('/store', function(req, res, next) {
	// Validate query string
	const category = (typeof req.query.category != 'undefined')?(req.query.category):'';
	const producer = (typeof req.query.producer != 'undefined')?(req.query.producer):'';
	const sort = (typeof req.query.sort != 'undefined')?(req.query.sort):'';
	const count = (typeof req.query.count != 'undefined')?parseInt(req.query.count):12;
	const page = (typeof req.query.page != 'undefined')?parseInt(req.query.page):1;

	// Arguments for find and sort query
	let findParams = {};
	let sortParams = {};
	// URI query string
	let classifyStr = '';
	let sortStr = '';

	if (category != '') {
		findParams.category = category;
		classifyStr += ('category=' + category + '&');
	}
	if (producer != '') {
		findParams.producer = producer;
		classifyStr += ('producer=' + producer + '&');
	}
	if (sort != '') {
		sortStr += ('sort=' + sort + '&');
		if (sort == 'name-asc') {
			sortParams.name = 1;
		}
		if (sort == 'name-des') {
			sortParams.name = -1;
		}
	}

	Product.find(findParams)
		.then(allProducts => {
			Product.find(findParams).sort(sortParams).limit(count).skip((page - 1) * count)
				.then(products => {
					res.render('pages/store', {
						user: req.user, // User
						products: products,
						name: ' ' + category + ' ' + producer,
						// Query string
						classifyStr: classifyStr,
						sortStr: sortStr,
						// Remain selection
						category: category,
						producer: producer,
						sort: sort,
						count: count,
						page: page,
						// Creating page index
						countPage: parseInt(allProducts.length / count +
							((allProducts.length % count == 0) ? 0 : 1)),
						countAll: allProducts.length,
						i: 1
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

// Advance Filter
router.post('/store', function(req, res) {
	const category = (typeof req.body.category != 'undefined')?(req.body.category):'';
	const producer = (typeof req.body.producer != 'undefined')?(req.body.producer):'';

	let queryStr = '';
	if (category != '') {
		queryStr += ('category=' + category + '&');
	}
	if (producer != '') {
		queryStr += ('producer=' + producer + '&');
	}
	res.redirect('/store?' + queryStr);
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
		});
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
