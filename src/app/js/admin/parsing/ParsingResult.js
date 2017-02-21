import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';
import Card from '../../lib/Card';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    clearParsing,
} from './';
import {
    fromParsing,
} from '../selectors';
import ParsingExcerpt from './ParsingExcerpt';

const styles = {
    list: {
        borderRight: `solid 1px ${grey400}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    title: {
        height: '36px',
        lineHeight: '36px',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

export class ParsingResultComponent extends Component {
    handleClearParsing = () => {
        event.preventDefault();
        event.stopPropagation();
        this.props.handleClearParsing();
    }

    render() {
        const {
            excerptColumns,
            excerptLines,
            totalLoadedLines,
            p: polyglot,
        } = this.props;

        return (
            <Card className="parsingResult" initiallyExpanded>
                <CardHeader
                    showExpandableButton
                    title={polyglot.t('parsing_summary', { count: totalLoadedLines })}
                    titleStyle={styles.title}
                >
                    <FlatButton
                        style={styles.button}
                        onClick={this.handleClearParsing}
                        label={polyglot.t('Upload another file')}
                    />
                </CardHeader>
                <CardText expandable>
                    <ParsingExcerpt
                        columns={excerptColumns}
                        lines={excerptLines}
                    />
                </CardText>
            </Card>
        );
    }
}

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    handleClearParsing: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
});

const mapDispatchToProps = {
    handleClearParsing: clearParsing,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
