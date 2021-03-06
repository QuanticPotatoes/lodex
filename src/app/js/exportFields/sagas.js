import { call, select, put, takeEvery } from 'redux-saga/effects';
import FileSaver from 'file-saver';
import fetchSaga from '../lib/sagas/fetchSaga';
import { fromUser } from '../sharedSelectors';

import {
    EXPORT_FIELDS,
    exportFieldsError,
} from './';

export const downloadFile = (blob) => {
    FileSaver.saveAs(blob, 'lodex_export.json');
};

export function* handleExportPublishedDatasetSuccess() {
    const request = yield select(fromUser.getExportFieldsRequest);
    const { error, response } = yield call(fetchSaga, request, [], 'blob');

    if (error) {
        yield put(exportFieldsError(error));
        return;
    }

    yield call(downloadFile, response);
}

export default function* () {
    yield takeEvery(EXPORT_FIELDS, handleExportPublishedDatasetSuccess);
}
