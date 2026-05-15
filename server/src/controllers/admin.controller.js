const adminService = require('../services/admin.service');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers(req.query);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(parseInt(req.params.id));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const user = await adminService.addUser(req.body);
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const getStores = async (req, res, next) => {
  try {
    const stores = await adminService.getStores(req.query);
    res.json({ success: true, data: stores });
  } catch (err) {
    next(err);
  }
};

const addStore = async (req, res, next) => {
  try {
    const store = await adminService.addStore(req.body);
    res.status(201).json({ success: true, message: 'Store created successfully', data: store });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getUsers, getUserById, addUser, getStores, addStore };
