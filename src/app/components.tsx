// components.tsx
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`mt-2 text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);


export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = "button"
}) => (
  <button
    type={type as any}
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 rounded-md
      bg-blue-600 text-white
      hover:bg-blue-700
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors duration-200
      ${className}
    `}
  >
    {children}
  </button>
);

export const Input = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  min,
  max,
  step,
  ...props
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
    className={`
      w-full px-3 py-2
      border border-gray-300 rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      placeholder-gray-400
      transition-shadow duration-200
      ${className}
    `}
    {...props}
  />
);

export const Alert = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`
      p-4 rounded-md border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '' }) => (
  <h5 className={`font-medium mb-1 ${className}`}>
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);