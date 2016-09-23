import React, { PropTypes } from 'react';
import classnames from 'classnames';

const FormMessage = ({ message, type, className, style }) => {
  const classes = classnames(className, type);
  return message ? <div style={style} className={classes}>{message}</div> : null;
};

FormMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  style: PropTypes.string,
  type: PropTypes.string
};

FormMessage.defaultProps = {
  className: 'message'
};

export default FormMessage;
