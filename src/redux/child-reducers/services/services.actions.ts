import { createAsyncThunk } from "@reduxjs/toolkit";
import { IService } from "./services.types";
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { openSnackbarDialog } from "../loading-and-snackbar";


// #########################################################################################################
// ####################################### Services Module #################################################
// #########################################################################################################

export const fetchMultipleServicesAsync = createAsyncThunk<{ count: number, data: IService[] }>(
    'services/fetchMultipleServicesAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.services.get_service)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleServicesWithArgsAsync = createAsyncThunk<{ count: number, data: IService[] }, ISearchQueryParamsV2>(
    'services/fetchMultipleServicesWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.services.get_service}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchSingleServiceWithArgsAsync = createAsyncThunkGetWrapper<IService, string>(
    'services/fetchSingleServiceWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.services.get_service}?services_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleServiceWithCallback {
    payload: IService,
    onSuccess: (isSuccess: boolean, data?: IService) => void
}
export const upsertSingleServiceWithCallbackAsync = createAsyncThunkPostWrapper<IService, IUpsertSingleServiceWithCallback>(
    'services/upsertSingleServiceWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.services.upsert_service, restPayload)
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