import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleUpdateCharacteristics({ payload }) {
    const request = yield select(fromUser.getUpdateCharacteristicsRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(updateCharacteristicsError(error));
    }

    return yield put(updateCharacteristicsSuccess(response));
}

export default function* () {
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}
