const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
var User = require('../models/user');

// Login Page
exports.loginPage = (req, res) => {
    res.render('pages/account/login');
}

// Register Page
exports.registerPage = (req, res) => {
    res.render('pages/account/register');
}

// Register Handle
exports.registerHandle = (req, res) => {
    const { name, email, password } = req.body;
    let errors = [];

    if (errors.length > 0) {
        res.render('pages/account/register', {
            errors
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email đã được đăng ký. Vui lòng nhập email khác.' });
                    res.render('pages/account/register', { errors });
                } else {
                    const newUser = new User({ name, email, password });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Bạn đã đăng ký thành công');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    }
}

// Login Handle
exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

// Logout Handle
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Bạn đã đăng xuất');
    res.redirect('/users/login');
}

// Profile Page
exports.profile = (req, res) => {
    res.render('pages/account/profile', { user: req.user });
}

// Forget Password
exports.forgetPassword = (req, res) => {
    res.render('pages/account/forget-password');
}

// Checkout
exports.checkOut = (req, res) => {
    res.render('pages/order/checkout', { user: req.user });
}