const storeOwnerService = require('../services/storeowner.service');

const getDashboard = async (req, res, next) => {
  try {
    const data = await storeOwnerService.getDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
