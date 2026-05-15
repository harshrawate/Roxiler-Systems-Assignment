const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const sizeClass = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, ...props }) => (
  <button
    className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && (
      <svg className="animate-spin -ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    )}
    {children}
  </button>
);

export default Button;
