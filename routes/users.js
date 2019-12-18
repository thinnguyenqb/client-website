var express = require('express');
var router = express.Router();
var accountControllers = require('../controllers/account-controllers');
const { ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', accountControllers.loginPage);

// Register Page
router.get('/register', accountControllers.registerPage);

// Register Handle
router.post('/register', accountControllers.registerHandle);

// Login Handle
router.post('/login', accountControllers.loginHandle);

// Logout Handle
router.get('/logout', accountControllers.logoutHandle);

// Profile
router.get('/profile', ensureAuthenticated, accountControllers.profile);

// Forget Password
router.get('/forget-password', accountControllers.forgetPassword);

// Checkout
router.get('/checkout', ensureAuthenticated, accountControllers.checkOut);

module.exports = router;
