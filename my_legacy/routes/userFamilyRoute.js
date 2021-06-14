const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

var usersFamilyController = require('../controllers/userFamilyController');

router.post('/set-new-member', auth, usersFamilyController.setNewMemmber);

router.post('/get-all-member', auth, usersFamilyController.getAllFamilyMembers);

router.post('/get-member-detail', auth, usersFamilyController.getMemberDetail);

module.exports = router;