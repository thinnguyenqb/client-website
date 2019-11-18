var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: { type: String },
    category: { type: String },
    manufacturer: { type: String },
    imgSrc: { type: String },
    price: { type: String },
    configuration: { type: String },
    description: { type: String }
});

module.exports = mongoose.model('product', productSchema, 'product');