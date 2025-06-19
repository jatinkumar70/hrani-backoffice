// ###################################################################################################
// #################################### Branch Module ################################################

import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { IBranch } from "./branch.types";
import { openSnackbarDialog } from "../../loading-and-snackbar";


export const fetchMultipleBranchesWithArgsAsync = createAsyncThunk<{ count: number, data: IBranch[] }, ISearchQueryParamsV2>(
    'branch/fetchMultipleBranchesWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.data_management.get_branch}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchSingleBranchWithArgsAsync = createAsyncThunkGetWrapper<IBranch, string>(
    'branch/fetchSingleBranchWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.data_management.get_branch}?branch_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleBranchWithCallback {
    payload: IBranch,
    onSuccess: (isSuccess: boolean, data?: IBranch) => void
}
export const upsertSingleBranchWithCallbackAsync = createAsyncThunkPostWrapper<IBranch, IUpsertSingleBranchWithCallback>(
    'branch/upsertSingleBranchWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        // thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.upload))
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.data_management.upsert_branch, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)