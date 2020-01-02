const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');

// Configure nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thanlinh.geass@gmail.com',
        pass: 'vnu20172021'
    }
});

var mailOptions = {
    from: 'thanlinh.geass@gmail.com'
};

// Models
var User = require('../models/user');

// Register Page
exports.registerPage = (req, res) => {
    res.render('pages/account/register');
}

// Activate Account Page
exports.activatePage = (req, res) => {
    // Find user by ID
    User.findOne({ _id: req.params.id })
        .then(user => {
            user.activated = true;
            user.save();
            res.render('pages/account/activate');
        })
        .catch(err => console.log(err));
}

// Login Page
exports.loginPage = (req, res) => {
    res.render('pages/account/login');
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

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    // Configure mailOptions
                                    mailOptions.to = email;
                                    mailOptions.subject = 'Kích hoạt tài khoản';
                                    mailOptions.text = 'Truy cập đường dẫn sau để kích hoạt tài khoản ' +
                                        req.protocol + '://' + req.get('host') + '/users/activate/' + user._id;

                                    // Send email
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });

                                    req.flash('success_msg', 'Bạn đã đăng ký thành công, vui lòng kiểm tra email và kích hoạt tài khoản');
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
