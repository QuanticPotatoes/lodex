import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
    },
    input: {
        marginLeft: '1rem',
    },
};

class TitleEdition extends Component {
    static propTypes = {
        level: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    }

    static defaultProps = {
        level: 1,
    }
    constructor(props) {
        super(props);

        this.state = {
            level: this.props.level,
        };
    }

    setLevel= (level) => {
        this.setState({ level });
        this.props.onChange({ level });
    }

    render() {
        const { level } = this.state;
        const { p: polyglot } = this.props;
        return (
            <div style={styles.container}>
                <SelectField
                    floatingLabelText={polyglot.t('list_format_select_level')}
                    onChange={(event, index, newValue) => this.setLevel(newValue)}
                    style={styles.input}
                    value={level}
                >
                    <MenuItem value={1} primaryText={polyglot.t('level1')} />
                    <MenuItem value={2} primaryText={polyglot.t('level2')} />
                    <MenuItem value={3} primaryText={polyglot.t('level3')} />
                    <MenuItem value={4} primaryText={polyglot.t('level4')} />
                </SelectField>
            </div>
        );
    }
}

export default translate(TitleEdition);
