import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';

import { withInitialDataHoc } from './withInitialData';
import { AdminComponent } from './Admin';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(AdminComponent);

    it('should call loadParsingResult on mount', () => {
        const loadParsingResult = createSpy();
        shallow(<Component
            hasUploadedFile
            loadParsingResult={loadParsingResult}
            loadPublication={() => {}}
            loadField={() => {}}
            p={{ t: () => {} }}
        />);
        expect(loadParsingResult).toHaveBeenCalled();
    });

    it('should call loadPublication on mount', () => {
        const loadPublication = createSpy();
        shallow(<Component
            hasUploadedFile
            loadPublication={loadPublication}
            loadParsingResult={() => {}}
            loadField={() => {}}
            p={{ t: () => {} }}
        />);
        expect(loadPublication).toHaveBeenCalled();
    });

    it('should call loadField on mount', () => {
        const loadField = createSpy();
        shallow(<Component
            hasUploadedFile
            loadPublication={() => {}}
            loadParsingResult={() => {}}
            loadField={loadField}
            p={{ t: () => {} }}
        />);
        expect(loadField).toHaveBeenCalled();
    });
});
