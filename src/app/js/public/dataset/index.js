import { createAction, handleActions, combineActions } from 'redux-actions';
import { APPLY_FACET } from '../facet';

export const LOAD_DATASET_PAGE = 'LOAD_DATASET_PAGE';
export const LOAD_DATASET_PAGE_SUCCESS = 'LOAD_DATASET_PAGE_SUCCESS';
export const LOAD_DATASET_PAGE_ERROR = 'LOAD_DATASET_PAGE_ERROR';

export const APPLY_FILTER = 'APPLY_FILTER';

export const loadDatasetPage = createAction(LOAD_DATASET_PAGE);
export const loadDatasetPageSuccess = createAction(LOAD_DATASET_PAGE_SUCCESS);
export const loadDatasetPageError = createAction(LOAD_DATASET_PAGE_ERROR);

export const applyFilter = createAction(APPLY_FILTER);

export const defaultState = {
    match: null,
    currentPage: 0,
    perPage: 10,
    dataset: [],
    loading: false,
    total: 0,
};

export default handleActions({
    [LOAD_DATASET_PAGE]: (state, { payload: { perPage } }) => ({
        ...state,
        error: null,
        loading: true,
        perPage,
    }),
    [combineActions(
        LOAD_DATASET_PAGE_SUCCESS,
    )]: (state, { payload: { dataset, page: currentPage, total } }) => ({
        ...state,
        currentPage,
        dataset,
        error: null,
        loading: false,
        total,
    }),
    [combineActions(
        LOAD_DATASET_PAGE_ERROR,
    )]: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
    }),
    [APPLY_FILTER]: (state, { payload: match }) => ({
        ...state,
        currentPage: 0,
        match,
    }),
    [APPLY_FACET]: state => ({
        ...state,
        currentPage: 0,
    }),
}, defaultState);

const isDatasetLoading = state => state.loading;
const getDatasetCurrentPage = state => state.currentPage;
const getDatasetPerPage = state => state.perPage;
const getDataset = state => state.dataset;
const getDatasetTotal = state => state.total;
const getFilter = state => state.match;

export const fromDataset = {
    isDatasetLoading,
    getDatasetCurrentPage,
    getDatasetPerPage,
    getDataset,
    getDatasetTotal,
    getFilter,
};
