import React, { PropTypes } from 'react';
import Button from './Button';

const Buttons = ({ buttons, className }) => (
  <div className={className}>
    {Object.keys(buttons).map((id, i) =>
      <Button {...buttons[id]} key={i} />
    )}
  </div>
);

Buttons.propTypes = {
  buttons: PropTypes.object,
  className: PropTypes.string
};

Buttons.defaultProps = {
  buttons: {},
  className: 'buttons'
};

export default Buttons;
