var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    password: { type: String },
    activated: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    role: { type: Number, default: "0" },
});

module.exports = mongoose.model('user', userSchema, 'user');