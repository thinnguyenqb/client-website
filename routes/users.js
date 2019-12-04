var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// User Model
var User = require('./../db/model/user');

// Login Page
router.get('/login', function(req, res, next) {
  res.render('pages/account/login');
});

// Register Page
router.get('/register', function(req, res, next) {
  res.render('pages/account/register');
});

// Register Handle
router.post('/register', (req, res) => {
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
        res.render('pages/account/register', {
          errors
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

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
    })
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Bạn đã đăng xuất');
  res.redirect('/users/login');
});

// Profile
router.get('/profile', ensureAuthenticated, function(req, res, next) {
  res.render('pages/account/profile', { user: req.user });
});

router.get('/forget-password', function(req, res, next) {
  res.render('pages/account/forget-password', { title: 'Express' });
});

router.get('/checkout', function(req, res, next) {
  res.render('pages/checkout', { title: 'Express' });
});

module.exports = router;
