import React, { PropTypes } from 'react';
import Field from './Field';

const Fields = ({ fields, className }) => (
  <div className={className}>
    {Object.keys(fields).map((id, i) =>
      <Field {...fields[id]} key={i} />
    )}
  </div>
);

Fields.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.object
};

Fields.defaultProps = {
  className: 'fields',
  fields: {}
};

export default Fields;
