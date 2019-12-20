var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    password: { type: String }
});

module.exports = mongoose.model('user', userSchema, 'user');