import React, { Component, PropTypes } from 'react';

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mount: true
    };
  }

  componentDidMount() {
    this.triggerUpdate();
  }

  componentDidUpdate(prevProps) {
    // Re-mount component so that we don't expose browser prefilled passwords if the component was
    // a password before and now something else.
    if (prevProps.formState !== this.props.formState) {
      this.setState({ mount: false });
    } else if (!this.state.mount) {
      this.setState({ mount: true });
      this.triggerUpdate();
    }
  }

  triggerUpdate() {
    // Trigger an onChange on inital load, to support browser prefilled values.
    const { onChange } = this.props;

    if (this.input) {
      onChange({ target: { value: this.input.value } });
    }
  }

  render() {
    const {
      className,
      defaultValue,
      hint,
      id,
      label,
      onChange,
      required,
      type
    } = this.props;

    const { mount } = this.state;

    if (type === 'notice') {
      return <div className={className}>{label}</div>;
    }

    return mount && (
      <div className='field-group'>
        <label htmlFor={id}>{label}</label>
        <div className='field'>
          <input
            id={id}
            name={id}
            type={type}
            ref={(ref) => this.input = ref}
            autoCapitalize={type === 'email' ? 'none' : false}
            autoCorrect='off'
            onChange={onChange}
            placeholder={hint}
            defaultValue={defaultValue}
            required={required} />
        </div>
      </div>
    );
  }
}

Field.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  type: PropTypes.string
};

Field.defaultProps = {
  className: 'field',
  defaultValue: '',
  required: false,
  type: 'text'
};

export default Field;
