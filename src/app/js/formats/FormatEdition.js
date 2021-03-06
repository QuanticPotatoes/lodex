import React, { Component } from 'react';

import SelectFormat from './SelectFormat';
import { getAdminComponent, FORMATS } from '../formats';
import { formField as formFieldPropTypes } from '../propTypes';

const styles = {
    container: {
        display: 'inline-flex',
        width: '100%',
    },
};

class FormatEdition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.input.value.name,
            args: props.input.value.args,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value.name !== this.state.name) {
            this.setState({ name: nextProps.input.value.name });
        }

        if (nextProps.input.value.args !== this.state.args) {
            this.setState({ args: nextProps.input.value.args });
        }
    }

    setArguments = (args) => {
        this.setState({ args });
        this.props.input.onChange({
            args,
            name: this.state.name,
        });
    }

    setFormat = (name) => {
        this.setState({ name });
        this.props.input.onChange({
            args: this.state.args,
            name,
        });
    }

    render() {
        const { name, args } = this.state;

        const AdminComponent = getAdminComponent(name);

        return (
            <div style={styles.container}>
                <SelectFormat
                    formats={FORMATS}
                    value={name}
                    onChange={this.setFormat}
                />
                <AdminComponent onChange={this.setArguments} {...{ ...this.props, ...args }} />
            </div>
        );
    }
}

FormatEdition.propTypes = formFieldPropTypes;

export default FormatEdition;
