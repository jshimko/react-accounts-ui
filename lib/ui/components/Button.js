import React, { PropTypes } from 'react';

const Button = ({ className, disabled, href, label, onClick, type }) => {

  if (type === 'link') {
    return <a href={href} className={className} onClick={onClick}>{label}</a>;
  }

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}>
      {label}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
};

export default Button;
