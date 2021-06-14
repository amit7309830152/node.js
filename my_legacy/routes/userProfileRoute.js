const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

var usersProfileController = require('../controllers/userProfileController');

router.post('/register', usersProfileController.registerUser);

router.post('/login', usersProfileController.loginUser);

router.post('/register-detail-one', auth, usersProfileController.registerDetailOne);

router.post('/register-detail-two', auth, usersProfileController.registerDetailTwo);

router.post('/register-phone', auth, usersProfileController.registerPhone);

router.post('/verify-phone', auth, usersProfileController.verifyPhone);

router.post('/update', auth, usersProfileController.updateProfile);

router.post('/get-profile', auth, usersProfileController.getUserProfile);

router.post('/change-password', auth, usersProfileController.changePassword);

router.post('/send-otp-change-password', usersProfileController.sendOtpChangePassword);

router.post('/verify-otp-change-password', usersProfileController.verifyOtpChangePassword);

// router.post('/login-fb', usersProfileController.loginFb);


module.exports = router;