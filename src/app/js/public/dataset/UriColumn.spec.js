import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';

import UriColumn from './UriColumn';

describe('<UriColumn />', () => {
    global.window = {
        location: {
            host: 'localhost',
            protocol: 'http:',
        },
    };

    const column = { name: 'a_name' };
    const resource = {
        uri: 'an_uri',
        a_name: 'a_value',
    };

    const wrapper = shallow(<UriColumn
        column={column}
        resource={resource}
    />);

    it('renders a TableRowColumn with correct class', () => {
        const element = wrapper.find(TableRowColumn);

        expect(element.prop('className')).toEqual('dataset-column dataset-a_name');
    });

    const link = wrapper.find(Link);
    it('renders a Link with correct href', () => {
        expect(link.prop('to')).toEqual('/uid:/an_uri');
    });

    it('renders a Link with correct text', () => {
        expect(link.children().text()).toEqual('a_value');
    });
});
