import { createAction, handleActions } from 'redux-actions';

export const LOAD_DATASET_PAGE = 'LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE_SUCCESS = 'LOAD_DATASET_PAGE_SUCCESS';
export const LOAD_DATASET_PAGE_ERROR = 'LOAD_DATASET_PAGE_ERROR';

export const loadDatasetPage = createAction(LOAD_DATASET_PAGE);
export const loadDatasetPageSuccess = createAction(LOAD_DATASET_PAGE_SUCCESS);
export const loadDatasetPageError = createAction(LOAD_DATASET_PAGE_ERROR);

export const defaultState = {
    currentPage: 0,
    dataset: [],
    loading: false,
    total: 0,
};

export default handleActions({
    LOAD_DATASET_PAGE: state => ({
        ...state,
        error: null,
        loading: true,
    }),
    LOAD_DATASET_PAGE_SUCCESS: (state, { payload: { dataset, page: currentPage, total } }) => ({
        ...state,
        currentPage,
        dataset,
        error: null,
        loading: false,
        total,
    }),
    LOAD_DATASET_PAGE_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
    }),
}, defaultState);

const isDatasetLoading = state => state.loading;
const getDatasetCurrentPage = state => state.currentPage;
const getDataset = state => state.dataset;
const getDatasetTotal = state => state.total;

export const fromDataset = {
    isDatasetLoading,
    getDatasetCurrentPage,
    getDataset,
    getDatasetTotal,
};