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

// Update Profile
router.post('/update-profile', accountControllers.updateProfile);

// Change Password Page
router.get('/change-password', ensureAuthenticated, accountControllers.changePasswordPage);

// Change Password Page
router.post('/change-password', accountControllers.changePasswordHandle);

// Forget Password
router.get('/forget-password', accountControllers.forgetPassword);

// Checkout Page
router.get('/checkout', ensureAuthenticated, accountControllers.checkoutPage);

// Checkout Handle
router.post('/checkout', accountControllers.checkoutHandle);

// Order Management
router.get('/order-management', ensureAuthenticated, accountControllers.orderManagement);

// Track Order
router.get('/track-order', ensureAuthenticated, accountControllers.trackOrder);
module.exports = router;
