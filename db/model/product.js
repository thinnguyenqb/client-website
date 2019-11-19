var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: { type: String },
    category: { type: String },
    imgSrc: { type: String },
    price: { type: String },
    old_price: { type: String },
    producer: { type: String },
    description: { type: String },
    configuration: { type: String }
});

module.exports = mongoose.model('product', productSchema, 'product');