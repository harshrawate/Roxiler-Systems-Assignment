const userService = require('../services/user.service');

const getStores = async (req, res, next) => {
  try {
    const stores = await userService.getStores(req.user.id, req.query);
    res.json({ success: true, data: stores });
  } catch (err) {
    next(err);
  }
};

const submitRating = async (req, res, next) => {
  try {
    const rating = await userService.submitRating(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Rating submitted', data: rating });
  } catch (err) {
    next(err);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const rating = await userService.updateRating(req.user.id, parseInt(req.params.id), req.body);
    res.json({ success: true, message: 'Rating updated', data: rating });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStores, submitRating, updateRating };
