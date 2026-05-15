const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../validators/schemas');

router.use(authenticate, requireRole('user'));

router.get('/stores', userController.getStores);
router.post('/ratings', validate('submitRating'), userController.submitRating);
router.put('/ratings/:id', validate('updateRating'), userController.updateRating);

module.exports = router;
