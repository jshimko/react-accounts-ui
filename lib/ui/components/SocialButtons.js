import React, { PropTypes } from 'react';
import Button from './Button';


const SocialButtons = ({ oauthServices, className }) => (
  <div className={className}>
    {Object.keys(oauthServices).map((id, i) => {
      return <Button {...oauthServices[id]} key={i} />;
    })}
  </div>
);

SocialButtons.propTypes = {
  className: PropTypes.string,
  oauthServices: PropTypes.object
};

SocialButtons.defaultProps = {
  className: 'social-buttons',
  oauthServices: {}
};

export default SocialButtons;
