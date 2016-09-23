import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Fields from './Fields';
import Buttons from './Buttons';
import FormMessage from './FormMessage';
import PasswordOrService from './PasswordOrService';
import SocialButtons from './SocialButtons';

class Form extends Component {

  componentDidMount() {
    const form = this.form;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }

  render() {
    const {
      oauthServices,
      fields,
      buttons,
      message,
      ready,
      className
    } = this.props;

    const classes = classnames('accounts-ui', className, { ready });

    return (
      <form ref={(ref) => this.form = ref} className={classes}>
        <Fields fields={fields} />
        <Buttons buttons={buttons} />
        <PasswordOrService oauthServices={oauthServices} />
        <SocialButtons oauthServices={oauthServices} />
        <FormMessage {...message} />
      </form>
    );
  }
}

Form.propTypes = {
  buttons: PropTypes.object.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
  fields: PropTypes.object.isRequired,
  message: PropTypes.object,
  oauthServices: PropTypes.object,
  ready: PropTypes.bool
};

Form.defaultProps = {
  ready: true
};

export default Form;
