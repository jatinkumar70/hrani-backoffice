import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { openSnackbarDialog } from "../loading-and-snackbar";
import { ICustomer, ICustomerInvoice, ICustomerService } from "./customers.types";


// #########################################################################################################
// ####################################### Customer Module #################################################
// #########################################################################################################

export const fetchMultipleCustomersAsync = createAsyncThunk<{ count: number, data: ICustomer[] }>(
    'customers/fetchMultipleCustomersAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.customers.get_customers)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleCustomersWithArgsAsync = createAsyncThunk<{ count: number, data: ICustomer[] }, ISearchQueryParamsV2>(
    'customers/fetchMultipleCustomersWithArgsAsync', async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customers}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchSingleCustomerWithArgsAsync = createAsyncThunkGetWrapper<ICustomer, string>(
    'customers/fetchSingleCustomerWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customers}?customer_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleCustomerWithCallback {
    payload: ICustomer,
    onSuccess: (isSuccess: boolean, data?: ICustomer) => void
}
export const upsertSingleCustomerWithCallbackAsync = createAsyncThunkPostWrapper<ICustomer, IUpsertSingleCustomerWithCallback>(
    'customers/upsertSingleCustomerWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.customers.upsert_customer, restPayload)
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












// #########################################################################################################
// ####################################### Customer Services Module #################################################
// #########################################################################################################

export const fetchCustomerMultipleServicesAsync = createAsyncThunk<{ count: number, data: ICustomerService[] }>(
    'customer-services/fetchCustomerMultipleServicesAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.customers.get_customer_services)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchCustomerMultipleServicesWithArgsAsync = createAsyncThunk<{ count: number, data: ICustomerService[] }, { queryParams: ISearchQueryParamsV2, customer_uuid: string }>(
    'customer-services/fetchCustomerMultipleServicesWithArgsAsync', async ({ queryParams, customer_uuid }, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customer_services}${searchQuery}&customer_uuid=${customer_uuid}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchCustomerSingleServiceWithArgsAsync = createAsyncThunkGetWrapper<ICustomerService, string>(
    'customer-services/fetchCustomerSingleServiceWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customer_services}?questions_options_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertCustomerSingleServiceWithCallback {
    payload: ICustomerService,
    onSuccess: (isSuccess: boolean, data?: ICustomerService) => void
}
export const upsertCustomerSingleServiceWithCallbackAsync = createAsyncThunkPostWrapper<ICustomerService, IUpsertCustomerSingleServiceWithCallback>(
    'customer-services/upsertCustomerSingleServiceWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.customers.upsert_customer_service, restPayload)
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





// #########################################################################################################
// ###################################### Customer Invocie Module ##########################################
// #########################################################################################################



export const fetchCustomerMultipleInvoicesWithArgsAsync = createAsyncThunk<{ count: number, data: ICustomerInvoice[] }, { queryParams: ISearchQueryParamsV2, customer_uuid: string }>(
    'customer-services/fetchCustomerMultipleInvoicesWithArgsAsync', async ({ queryParams, customer_uuid }, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customer_invoice}${searchQuery}&customer_uuid=${customer_uuid}`)
        const { data, totalRecords: count } = response.data;
        return thunkAPI.fulfillWithValue({ count, data })
    }
)


export const fetchCustomerSingleInvoiceWithArgsAsync = createAsyncThunkGetWrapper<ICustomerInvoice, string>(
    'customer-services/fetchCustomerSingleInvoiceWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customer_invoice}?questions_options_uuid=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertCustomerSingleInvoiceWithCallback {
    payload: ICustomerInvoice,
    onSuccess: (isSuccess: boolean, data?: ICustomerInvoice) => void
}
export const upsertCustomerSingleInvoiceWithCallbackAsync = createAsyncThunkPostWrapper<ICustomerInvoice, IUpsertCustomerSingleInvoiceWithCallback>(
    'customer-services/upsertCustomerSingleInvoiceWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.customers.upsert_customer_invoice, restPayload)
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