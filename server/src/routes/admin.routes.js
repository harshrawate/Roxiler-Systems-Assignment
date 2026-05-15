const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../validators/schemas');

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.post('/users', validate('addUser'), adminController.addUser);
router.get('/users/:id', adminController.getUserById);
router.get('/stores', adminController.getStores);
router.post('/stores', validate('addStore'), adminController.addStore);

module.exports = router;
