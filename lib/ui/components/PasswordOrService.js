import React, { Component, PropTypes } from 'react';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { hasPasswordService } from '../../helpers';

class PasswordOrService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPasswordService: hasPasswordService(),
      services: Object.keys(props.oauthServices).map((service) => {
        return props.oauthServices[service].label;
      })
    };
  }

  render() {
    const { className, style } = this.props;

    let services = this.state.services;

    if (services.length > 2) {
      services = [];
    }

    if (this.state.hasPasswordService && services.length > 0) {
      return (
        <div style={style} className={className}>
          {`${T9n.get('orUse')} ${services.join(' / ')}`}
        </div>
      );
    }

    return null;
  }
}

PasswordOrService.propTypes = {
  className: PropTypes.string,
  oauthServices: PropTypes.object,
  style: PropTypes.object
};

PasswordOrService.defaultProps = {
  className: 'password-or-service'
};

export default PasswordOrService;
