var Product = require('../models/product');
var functions = require('./functions');

exports.displayProducts = (req, res) => {
    // Validate query string
	const category = (typeof req.query.category != 'undefined')?(req.query.category):'';
	const producer = (typeof req.query.producer != 'undefined')?(req.query.producer):'';
	const min = (typeof req.query.min != 'undefined')?parseInt(req.query.min):0;
	const max = (typeof req.query.max != 'undefined')?parseInt(req.query.max):50000000;
	const sort = (typeof req.query.sort != 'undefined')?(req.query.sort):'';
	const count = (typeof req.query.count != 'undefined')?parseInt(req.query.count):12;
	const page = (typeof req.query.page != 'undefined')?parseInt(req.query.page):1;

	// Arguments for find and sort query
	let findParams = {};
	let sortParams = {};
	// URI query string
	let filterStr = '';
	let sortStr = '';

	if (category != '') {
		findParams.category = category;
		filterStr += ('category=' + category + '&');
	}
	if (producer != '') {
		findParams.producer = producer;
		filterStr += ('producer=' + producer + '&');
	}

	findParams.price = { $gte: min, $lte: max };
	filterStr += ('min=' + min + '&max=' + max + '&');

	if (sort != '') {
        sortStr += ('sort=' + sort + '&');
        switch (sort) {
            case 'name-asc':
                sortParams.name = 1; break;
            case 'name-des':
                sortParams.name = -1; break;
            case 'price-asc':
                sortParams.price = 1; break;
            case 'price-des':
                sortParams.price = -1;
          }
	}

	Product.count(findParams)
		.then(countAll => {
			Product.find(findParams).sort(sortParams).limit(count).skip((page - 1) * count)
				.then(products => {
					res.render('pages/store', {
						user: req.user, // User
						products: products,
						priceConverter: functions.numberWithCommas,
						// Query string
						filterStr: filterStr, sortStr: sortStr,
						// Remain selection
						category: category, producer: producer, min: min, max: max, sort: sort, count: count, page: page,
						// Creating page index
						countPage: parseInt(countAll / count +
							((countAll % count == 0) ? 0 : 1)),
						countAll: countAll,
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
}

exports.filter = (req, res) => {
    const category = (typeof req.body.category != 'undefined')?(req.body.category):'';
	const producer = (typeof req.body.producer != 'undefined')?(req.body.producer):'';
	const min = req.body.min;
	const max = req.body.max;

	let queryStr = '';
	if (category != '') {
		queryStr += ('category=' + category + '&');
	}
	if (producer != '') {
		queryStr += ('producer=' + producer + '&');
	}
	queryStr += 'min=' + min + '&';
	queryStr += 'max=' + max;
	res.redirect('/store?' + queryStr);
}

exports.productInfo = (req, res) => {
    Product.findOne({ _id: req.params.id })
		.then(product => {
			res.render('pages/product', {
                product: product,
                user: req.user,
                priceConverter: functions.numberWithCommas
            });
		})
		.catch(err => {
			console.log('Error: ', err);
			throw err;
		});
}