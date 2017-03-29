import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FIELD_FORM_NAME } from '../';

import { polyglot as polyglotPropTypes } from '../../../propTypes';

const styles = {
    inset: {
        paddingLeft: 40,
    },
    radio: {
        marginTop: 12,
    },
};

export const StepValueColumnComponent = ({
    column,
    datasetFields,
    handleChange,
    handleSelect,
    p: polyglot,
    selected,
}) => (
    <div>
        <RadioButton
            label={polyglot.t('a_column')}
            value="column"
            onClick={handleSelect}
            checked={selected}
            style={styles.radio}
        />
        {selected &&
            <div style={styles.inset}>
                <SelectField
                    id="select_column"
                    onChange={handleChange}
                    style={styles.select}
                    hintText={polyglot.t('select_a_column')}
                    value={column}
                >
                    {datasetFields.map(datasetField => (
                        <MenuItem
                            key={datasetField}
                            value={datasetField}
                            primaryText={datasetField}
                        />
                    ))}
                </SelectField>
            </div>
        }
    </div>
);

StepValueColumnComponent.propTypes = {
    column: PropTypes.string,
    datasetFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selected: PropTypes.bool.isRequired,
};

StepValueColumnComponent.defaultProps = {
    column: undefined,
};

const mapStateToProps = (state) => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(state, 'transformers');

    const valueTransformer =
        transformers && transformers[0] && transformers[0].operation === 'COLUMN'
        ? transformers[0]
        : null;

    if (valueTransformer) {
        return {
            selected: true,
            column: (valueTransformer.args && valueTransformer.args[0] && valueTransformer.args[0].value) || null,
        };
    }

    return { selected: false, column: null };
};

export default compose(
    connect(mapStateToProps),
    withState('column', 'setColumn', ({ column }) => column),
    withHandlers({
        handleSelect: ({ onChange, column }) => () => {
            onChange({
                operation: 'COLUMN',
                args: [{
                    name: 'column',
                    type: 'column',
                    value: column,
                }],
            });
        },
        handleChange: ({ onChange, setColumn }) => (event, key, value) => {
            setColumn(value);
            onChange({
                operation: 'COLUMN',
                args: [{
                    name: 'column',
                    type: 'column',
                    value,
                }],
            });
        },
    }),
    translate,
)(StepValueColumnComponent);