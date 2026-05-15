import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, id, required, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      id={id}
      ref={ref}
      className={`input-field ${error ? 'input-error' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
