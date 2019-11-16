var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: { type: String },
    category: { type: String },
    imgSrc: { type: String },
    price: { type: String }
});

module.exports = mongoose.model('product', productSchema, 'product');