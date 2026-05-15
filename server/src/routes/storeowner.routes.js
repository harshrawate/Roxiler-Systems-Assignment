const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeowner.controller');
const authenticate = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.use(authenticate, requireRole('store_owner'));

router.get('/dashboard', storeOwnerController.getDashboard);

module.exports = router;
