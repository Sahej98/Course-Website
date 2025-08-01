import React from 'react';

const Button = ({ children, href, variant = 'primary', ...props }) => {
  const base = 'button';
  const classes = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    outline: 'button-outline',
  };
  return href ? (
    <a href={href} className={`${base} ${classes[variant] || ''}`} {...props}>
      {children}
    </a>
  ) : (
    <button className={`${base} ${classes[variant] || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
