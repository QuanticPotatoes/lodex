/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import {
    doPublish,
    preparePublish,
    handlePublishError,
    tranformAllDocuments,
    addTransformResultToDoc,
    versionTransformResult,
    publishCharacteristics,
    publishFacets,
} from './publish';
import getDocumentTransformer from '../../services/getDocumentTransformer';

describe('publish', () => {
    describe('doPublish', () => {
        const fields = [
            { name: 'uri', cover: 'collection' },
            { name: 'field2', cover: 'collection' },
            { name: 'field3', cover: 'dataset' },
        ];

        const publishedDataset = [
            { field1: 'field1_value', field2: 'field2_value', field3: 'field3_value' },
        ];

        const ctx = {
            versionTransformResult: createSpy().andReturn('transformDocumentAndKeepUri()'),
            addTransformResultToDoc: createSpy().andReturn('addUri()'),
            dataset: {
                count: createSpy().andReturn(Promise.resolve('count')),
                findLimitFromSkip: 'dataset.findLimitFromSkip()',
            },
            field: {
                findAll: createSpy().andReturn(fields),
            },
            getDocumentTransformer: createSpy().andReturn('transformDocument()'),
            publishedCharacteristic: {
                addNewVersion: createSpy(),
            },
            publishedDataset: {
                findLimitFromSkip: createSpy().andReturn(publishedDataset),
                insertBatch: 'publishedDataset.insertBatch()',
                countByFacet: createSpy().andReturn(100),
            },
            redirect: createSpy(),
            tranformAllDocuments: createSpy(),
            uriDataset: {
                insertBatch: 'uriDataset.insertBatch()',
                findLimitFromSkip: 'uriDataset.findLimitFromSkip()',
            },
            publishCharacteristics: createSpy(),
            publishFacets: createSpy(),
        };

        before(async () => {
            await doPublish(ctx);
        });

        it('should get the total number of items in the original dataset', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({});
        });

        it('should get the columns', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should call getDocumentTransformer to get the uri transformers', () => {
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith([fields[0]]);
        });

        it('should call ctx.addTransformResultToDoc with transformDocument', () => {
            expect(ctx.addTransformResultToDoc).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'dataset.findLimitFromSkip()', 'uriDataset.insertBatch()', 'addUri()');
        });

        it('should call getDocumentTransformer with all other fields', () => {
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith([fields[1]]);
        });

        it('should call ctx.versionTransformResult with transformDocument', () => {
            expect(ctx.versionTransformResult).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'uriDataset.findLimitFromSkip()', 'publishedDataset.insertBatch()', 'transformDocumentAndKeepUri()');
        });

        it('should call publishCharacteristics', () => {
            expect(ctx.publishCharacteristics).toHaveBeenCalledWith(ctx, [{
                name: 'field3',
                cover: 'dataset',
            }], 'count');
        });

        it('should redirect to the publication route', () => {
            expect(ctx.redirect).toHaveBeenCalledWith('/api/publication');
        });
    });

    describe('publishCharacteristics', () => {
        const transformDocument = createSpy().andReturn({ transformed: 'document' });
        const count = 5;
        const ctx = {
            getDocumentTransformer: createSpy().andReturn(transformDocument),
            uriDataset: {
                findLimitFromSkip: createSpy().andReturn(['doc']),
            },
            publishedCharacteristic: {
                addNewVersion: createSpy(),
            },
        };
        const datasetFields = [{
            name: 'transformed',
            scheme: 'scheme',
        }];

        before(async () => {
            await publishCharacteristics(ctx, datasetFields, count);
        });

        it('should call getDocumentTransformer', () => {
            expect(ctx.getDocumentTransformer)
            .toHaveBeenCalledWith(datasetFields);
        });

        it('should call ctx.uriDataset.findLimitFromSkip', () => {
            expect(ctx.uriDataset.findLimitFromSkip)
                .toHaveBeenCalledWith(1, count - 1);
        });

        it('should call transformDocument returned by getDocumentTransformer', () => {
            expect(transformDocument).toHaveBeenCalledWith('doc');
        });

        it('should call ctx.publishedCharacteristic.addNewVersion', () => {
            expect(ctx.publishedCharacteristic.addNewVersion).toHaveBeenCalledWith({
                transformed: 'document',
            });
        });
    });

    describe('publishFacets', () => {
        const ctx = {
            publishedDataset: {
                findDistinctValuesForField: createSpy().andReturn(Promise.resolve(['value1', 'value2'])),
                countByFacet: createSpy().andReturn(Promise.resolve(100)),
            },
            publishedFacet: {
                insertFacet: createSpy().andReturn(Promise.resolve()),
            },
        };
        const facetFields = [{
            name: 'facet1',
        }, {
            name: 'facet2',
        }];

        before(async () => {
            await publishFacets(ctx, facetFields);
        });

        it('should call publishedDataset.findDistinctValuesForField for each facet field', () => {
            expect(ctx.publishedDataset.findDistinctValuesForField).toHaveBeenCalledWith('facet1');
            expect(ctx.publishedDataset.findDistinctValuesForField).toHaveBeenCalledWith('facet2');
        });

        it('should call ctx.publishedFacet.insertFacet for each facet field with their distinct values', () => {
            expect(ctx.publishedFacet.insertFacet).toHaveBeenCalledWith('facet1', [{ value: 'value1', count: 100 }, { value: 'value2', count: 100 }]);
            expect(ctx.publishedFacet.insertFacet).toHaveBeenCalledWith('facet2', [{ value: 'value1', count: 100 }, { value: 'value2', count: 100 }]);
        });
    });

    describe('preparePublish', () => {
        it('should provide ctx with needed dependency', async () => {
            const ctx = {};
            const next = createSpy();
            await preparePublish(ctx, next);

            expect(ctx).toEqual({
                tranformAllDocuments,
                getDocumentTransformer: getDocumentTransformer(ctx),
                addTransformResultToDoc,
                versionTransformResult,
                publishCharacteristics,
                publishFacets,
            });
        });
    });

    describe('handlePublishError', () => {
        it('should remove uriDataset and publishedDataset if next fail', (done) => {
            const ctx = {
                uriDataset: {
                    remove: createSpy(),
                },
                publishedDataset: {
                    remove: createSpy(),
                },
                publishedCharacteristic: {
                    remove: createSpy(),
                },
            };
            const error = new Error('Boom');
            const next = createSpy().andReturn(Promise.reject(error));
            handlePublishError(ctx, next)
            .then(() => {
                throw new Error('tryPublish promise should have been rejected');
            })
            .catch((e) => {
                expect(e).toEqual(error);
                expect(ctx.uriDataset.remove).toHaveBeenCalled();
                expect(ctx.publishedDataset.remove).toHaveBeenCalled();
                expect(ctx.publishedCharacteristic.remove).toHaveBeenCalled();
                done();
            })
            .catch(done);
        });
    });

    describe('tranformAllDocuments', () => {
        const dataset = [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }];
        const count = 201;
        const findLimitFromSkip = createSpy().andReturn(dataset);
        const insertBatch = createSpy();
        const transformDocument = createSpy().andReturn(Promise.resolve('transformedDocument'));

        before(async () => {
            await tranformAllDocuments(count, findLimitFromSkip, insertBatch, transformDocument);
        });
        it('should load items from the original dataset and insert them in the publishedDataset by page of 100', () => {
            expect(findLimitFromSkip).toHaveBeenCalledWith(100, 0);
            expect(findLimitFromSkip).toHaveBeenCalledWith(100, 200);
            expect(insertBatch).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
        });

        it('should call transform document with each document in dataset', () => {
            expect(transformDocument).toHaveBeenCalledWith(dataset[0], 0, dataset);
            expect(transformDocument).toHaveBeenCalledWith(dataset[1], 1, dataset);
        });

        it('should insert all transformedDocument', () => {
            expect(insertBatch).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
        });
    });

    describe('addTransformResultToDoc', () => {
        it('should add transform result to doc omitting doc._id', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                data: 'value',
            };

            expect(await addTransformResultToDoc(transform)(doc)).toEqual({
                data: 'value',
                transformed: 'data',
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });

    describe('versionTransformResult', () => {
        it('should add doc.uri to transform result', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                uri: 'uri',
                data: 'value',
            };
            const date = new Date();
            expect(await versionTransformResult(transform)(doc, null, null, date)).toEqual({
                uri: 'uri',
                versions: [{
                    transformed: 'data',
                    publicationDate: date,
                }],
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });
});
