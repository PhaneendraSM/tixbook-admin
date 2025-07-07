import React from 'react';

function Button({ type, children, onClick, disabled, className = '' }) {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`button ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
