import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import get from 'lodash.get';

import FormTextField from '../lib/components/FormTextField';
import FieldInput from '../lib/components/FieldInput';
import { fromFields } from '../sharedSelectors';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';

const required = polyglot => value => (value ? undefined : polyglot.t('required'));
const uniqueField = (fields, polyglot) => (value, _, props) =>
    (get(props, 'field.label') !== value && fields.find(({ label }) => label === value) ? polyglot.t('field_label_exists') : undefined);

const getValidation = memoize((fields, polyglot) => [
    required(polyglot),
    uniqueField(fields, polyglot),
]);

export const FieldLabelInputComponent = ({ fields, disabled, p: polyglot }) => (
    <FieldInput
        name="label"
        component={FormTextField}
        labelKey="fieldLabel"
        fullWidth
        disabled={disabled}
        validate={getValidation(fields, polyglot)}
    />
);

FieldLabelInputComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    disabled: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

FieldLabelInputComponent.defaultProps = {
    validate: false,
    isNewField: false,
    disabled: false,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(FieldLabelInputComponent);
