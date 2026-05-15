const colors = {
  admin: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
  store_owner: 'bg-emerald-100 text-emerald-700',
  default: 'bg-gray-100 text-gray-600',
};

const labels = {
  admin: 'Admin',
  user: 'User',
  store_owner: 'Store Owner',
};

const Badge = ({ role }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] ?? colors.default}`}>
    {labels[role] ?? role}
  </span>
);

export default Badge;
