const bcrypt = require('bcryptjs');
const passport = require('passport');

// Models
var User = require('../models/user');
var Order = require('../models/order');

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

// Update Profile
exports.updateProfile = (req, res) => {
    let errors = [];
    const newName = req.body.name;
    const newPhone = req.body.phone;
    const newAddress = req.body.address;

    User.findOne({ _id: req.user._id }) // Find user by ID
        .then(user => {
            if (newName != '') {
                user.name = newName;
            }
            if (newPhone != '') {
                user.phone = newPhone;
            }
            if (newAddress != '') {
                user.address = newAddress;
            }
            user.save()
                .then(user => {
                    req.flash('success_msg', 'Bạn đã cập nhật thành công');
                    res.redirect('/users/profile');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

// Change Password Page
exports.changePasswordPage = (req, res) => {
    res.render('pages/account/change-password', { user: req.user });
}

// Change Password Handle
exports.changePasswordHandle = (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    User.findOne({ _id: req.user._id }) // Find user by ID
        .then(user => {
            // Recheck old password
            bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) { // Match
                    // Hash new password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            user.password = hash;
                            // Save new password
                            user.save()
                                .then(user => {
                                    req.flash('success_msg', 'Bạn đã đổi mật khẩu thành công');
                                    res.redirect('/users/change-password');
                                })
                                .catch(err => console.log(err));
                        }));
                } else { // Not match
                    req.flash('error_msg', 'Mật khẩu cũ không đúng');
                    res.redirect('/users/change-password');
                }
            });
        })
        .catch(err => console.log(err));
}

// Forget Password
exports.forgetPassword = (req, res) => {
    res.render('pages/account/forget-password');
}

// Checkout Page
exports.checkoutPage = (req, res) => {
    res.render('pages/order/checkout', { user: req.user });
}

// Checkout Handle
exports.checkoutHandle = (req, res) => {
    var tokens = req.body.items.split('//');
    tokens.pop(); // The last element is empty

    var newOrder = new Order({
        date: new Date(),
        userID: req.user._id,
        username: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        note: req.body.note,
        totalCost: req.body.total,
        status: 0
    })

    tokens.forEach(entry => {
        var properties = entry.split(';');
        newOrder.items.push({
            _id: properties[0],
            name: properties[1],
            quantity: parseInt(properties[2])
        });
    });

    newOrder.save();

    res.redirect('/users/order-management');
}

// Order Management
exports.orderManagement = (req, res) => {
    res.render('pages/order/order-management', { 
        user: req.user
     });
}

// Track Order
exports.trackOrder = (req, res) => {
    res.render('pages/order/trackOrder', { 
        user: req.user
     });
}
