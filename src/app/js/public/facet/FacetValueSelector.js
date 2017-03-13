import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import memoize from 'lodash.memoize';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFacet } from '../selectors';
import { loadFacetValues as loadFacetValuesAction, applyFacet as applyFacetAction } from './index';

export const getValues = memoize(values => values.map(value => ({
    text: value,
    value: (
        <MenuItem
            className={`facet-value-${value.toLowerCase()}`}
            primaryText={value}
            value={value}
        />
    ),
})));

export const FacetValueSelectorComponent = ({
    handleChange,
    handleFilterChange,
    values,
    p: polyglot,
    selectedFacet,
}) => (
    <AutoComplete
        className="facet-value-selector"
        dataSource={getValues(values)}
        onNewRequest={handleChange}
        onUpdateInput={handleFilterChange}
        openOnFocus
        hintText={polyglot.t('select_facet_value', { facet: selectedFacet.label })}
        filter={AutoComplete.fuzzyFilter}
    />
);

FacetValueSelectorComponent.propTypes = {
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleChange: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedFacet: fieldPropTypes,
};

FacetValueSelectorComponent.defaultProps = {
    selectedFacet: null,
};

const mapStateToProps = state => ({
    selectedFacet: fromFacet.getSelectedFacet(state),
    ...fromFacet.getSelectedFacetValues(state),
});

const mapDispatchToProps = ({
    applyFacet: applyFacetAction,
    loadFacetValues: loadFacetValuesAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChange: ({ applyFacet, selectedFacet: field }) => ({ text: value }, index) => {
            if (index > -1) {
                applyFacet({ field, value });
            }
        },
        handleFilterChange: ({ loadFacetValues, selectedFacet: field }) => (filter) => {
            loadFacetValues({
                field,
                filter,
            });
        },
    }),
    translate,
)(FacetValueSelectorComponent);