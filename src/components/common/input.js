import React from 'react';

function Input({ type, placeholder, value, onChange, required, className = '' }) {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required}
      className={`input ${className}`}
    />
  );
}

export default Input;
