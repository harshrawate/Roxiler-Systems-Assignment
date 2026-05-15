const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');
const validate = require('../validators/schemas');

router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
router.post('/change-password', authenticate, validate('changePassword'), authController.changePassword);

module.exports = router;
