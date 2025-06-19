import type { ISearchQueryParams, ISearchQueryParamsV2 } from "./store.types";


export const getSearchQueryParams = (queryParams: ISearchQueryParams): string => {
    const { page, rowsPerPage, status, value, columns, fromDate, toDate } =
        queryParams;
    let query = "?";
    if (status && status !== "-1") {
        query += `status=${status}&`;
    }
    if (columns && value && value.length > 0 && columns.length > 0) {
        query += `columns=${columns}&`;
    }
    if (value) {
        query += `value=${value}&`;
    }
    if (fromDate) {
        query += `from_date=${fromDate}&`;
    }
    if (toDate) {
        query += `to_date=${toDate}&`;
    }
    query += `pageNo=${page}&itemPerPage=${rowsPerPage}`;
    return query;
};



export const getSearchQueryParamsV2 = (queryParams: ISearchQueryParamsV2): string => {
    const { page, rowsPerPage, status, date, moduleName, searchValue, subModuleName, tableName, columns, advanceFilter } = queryParams;

    let query = "?";
    if (status && status !== "-1") {
        query += `status=${status}&`;
    }
    if (tableName) {
        query += `table_name=${tableName}&`;
    }
    if (moduleName) {
        query += `module_name=${moduleName}&`;
    }
    if (subModuleName) {
        query += `sub_module_name=${subModuleName}&`;
    }
    if (searchValue && searchValue.length > 0) {
        query += `value=${searchValue}&`;
    }
    if (columns && columns.length > 0) {
        query += `columns=${columns}&`;
    }
    if (date?.fromDate) {
        query += `from_date=${date.fromDate}&`;
    }
    if (date?.toDate) {
        query += `to_date=${date.toDate}&`;
    }
    if (advanceFilter) {
        query += `advanceFilter=${advanceFilter}&`;
    }
    query += `pageNo=${page}&itemPerPage=${rowsPerPage}`;
    return query;
};