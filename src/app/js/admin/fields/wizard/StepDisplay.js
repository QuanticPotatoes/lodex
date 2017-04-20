import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';

import Step from './Step';
import FormCheckboxField from '../../../lib/components/FormCheckboxField';
import PositionField from '../PositionField';
import Format from '../../FormatEdition';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';
import { FIELD_FORM_NAME } from '../';

export class StepDisplayComponent extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.transformers.find(t => t.operation === 'LINK') && !nextProps.format) {
            this.props.updateField(FIELD_FORM_NAME, 'format', { name: 'uri', args: { type: 'value' } });
        }
    }

    render() {
        const {
            field,
            p: polyglot,
            ...props
        } = this.props;

        return (
            <Step label="field_wizard_step_display" {...props}>
                <Field
                    name="display_in_list"
                    component={FormCheckboxField}
                    label={polyglot.t('field_display_in_list')}
                />
                <Field
                    name="display_in_resource"
                    component={FormCheckboxField}
                    label={polyglot.t('field_display_in_resource')}
                />
                <PositionField field={field} />
                <Field
                    name="format"
                    component={Format}
                    label={polyglot.t('format')}
                />
            </Step>
        );
    }
}

StepDisplayComponent.propTypes = {
    transformers: PropTypes.arrayOf(PropTypes.object).isRequired,
    field: fieldPropTypes.isRequired,
    format: PropTypes.object, // eslint-disable-line
    p: polyglotPropTypes.isRequired,
    updateField: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const { format, transformers } = getFormValues(FIELD_FORM_NAME)(state);

    return {
        format,
        transformers,
    };
};

const mapDispatchToProps = { updateField: change };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(StepDisplayComponent);
