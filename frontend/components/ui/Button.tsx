import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="small" /> : children}
    </button>
  );
}
