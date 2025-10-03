import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Função utilitária local para combinar classes CSS
const combineClasses = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className, 
  id, 
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={combineClasses(
          baseClasses,
          errorClasses,
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};