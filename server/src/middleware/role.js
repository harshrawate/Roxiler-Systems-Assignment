/**
 * Role-based access control middleware factory.
 * Usage: requireRole('admin') or requireRole('admin', 'store_owner')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = requireRole;
