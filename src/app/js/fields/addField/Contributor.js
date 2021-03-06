import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import FormTextField from '../../lib/components/FormTextField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const required = value => (value ? undefined : 'Required');
const validMail = value =>
    (value.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
    ) ? undefined : 'Invalid mail');

export const AddFieldDetailComponent = ({
    p: polyglot,
}) => (
    <div>
        <Field
            validate={required}
            name="contributor.name"
            className="contributor-name"
            component={FormTextField}
            label={polyglot.t('contributorName')}
            fullWidth
        />
        <Field
            validate={[required, validMail]}
            name="contributor.mail"
            className="contributor-mail"
            component={FormTextField}
            label={polyglot.t('contributorMail')}
            fullWidth
        />
    </div>
);

AddFieldDetailComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(AddFieldDetailComponent);
