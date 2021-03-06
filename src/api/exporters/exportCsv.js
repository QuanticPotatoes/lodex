import { csv } from 'json-csv';
import through from 'through';
import omit from 'lodash.omit';

import { VALIDATED } from '../../common/propositionStatus';

export const removeContributions = (doc, contributions) => {
    const fieldsToIgnore = contributions
        .filter(({ status }) => status !== VALIDATED)
        .map(({ fieldName }) => fieldName);

    return omit(doc, fieldsToIgnore);
};

export const getLastVersionFactory = defaultDocument => function getLastVersion({ uri, versions, contributions = [] }) {
    const lastVersion = versions[versions.length - 1];
    const lastVersionWithoutContribution = removeContributions(lastVersion, contributions);

    this.queue({
        ...defaultDocument,
        ...lastVersionWithoutContribution,
        uri,
    });
};

export const getCsvFieldFactory = getCharacteristicByName => ({ cover, label, name }) => ({
    filter: value => (cover === 'dataset' ? getCharacteristicByName(name) : value),
    label: label || name,
    name,
    quoted: true,
});

export const getDefaultDocuments = fields =>
    Object.keys(fields).reduce((acc, key) => ({
        [key]: '',
    }));

export const exportCsvFactory = csvTransformStreamFactory => (config, fields, characteristics, stream) => {
    const defaultDocument = getDefaultDocuments(fields);
    const getCharacteristicByName = name => characteristics[0][name];
    const getCsvField = getCsvFieldFactory(getCharacteristicByName);

    const jsoncsvStream = csvTransformStreamFactory({
        fields: fields.map(getCsvField),
        fieldSeparator: ';',
    });

    return stream
        .pipe(through(getLastVersionFactory(defaultDocument)))
        .pipe(jsoncsvStream);
};

const exporter = exportCsvFactory(csv);
exporter.extension = 'csv';
exporter.mimeType = 'text/csv';
exporter.type = 'file';
exporter.label = 'csv';

export default exporter;
