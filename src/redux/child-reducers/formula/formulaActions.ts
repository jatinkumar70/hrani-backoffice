import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import { showMessage } from "../../messages/messagesActions";
import { IFormula, IBookingSource, IOTAOption, IFormulaCalculatorLog } from "./formula.types";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";

export const fetchFormulaAsync = createAsyncThunk<{ count: number, data: IFormula[] }, ISearchQueryParamsV2>(
    'formula/fetchFormulaAsync',
    async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await api.get(`/formulas/get-formulas${searchQuery}`);
            const { data, totalRecords: count } = response.data;
            return { count, data };
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// New action to fetch OTA options
export const fetchOTAOptionsAsync = createAsyncThunk<IOTAOption[], { source_reference_in_pms?: string } | void>(
    'formula/fetchOTAOptionsAsync',
    async (params, thunkAPI) => {
        try {
            let url = '/formulas/get-formula-external-variable';
            if (params && params.source_reference_in_pms) {
                url += `?source_reference_in_pms=${encodeURIComponent(params.source_reference_in_pms)}`;
            }
            const response = await api.get(url);
            // Extract unique referers from the response
            const otaOptions: IOTAOption[] = [];
            const uniqueReferers = new Set<string>();
            // Handle if response.data is an array
            const dataArray = Array.isArray(response.data?.data) ? response.data.data : [response.data?.data];
            dataArray.forEach((item: any) => {
                if (item?.booking?.referer) {
                    uniqueReferers.add(item.booking.referer);
                }
            });
            // If no data found in array format, try single object format
            if (uniqueReferers.size === 0 && response.data?.data?.booking?.referer) {
                uniqueReferers.add(response.data.data.booking.referer);
            }
            // Convert Set to array of IOTAOption objects
            uniqueReferers.forEach(referer => {
                otaOptions.push({ referer });
            });
            return otaOptions;
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// New action to fetch booking sources
export const fetchBookingSourcesAsync = createAsyncThunk<{ count: number, data: IBookingSource[] }, ISearchQueryParamsV2>(
    'formula/fetchBookingSourcesAsync',
    async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await api.get(`/formulas/get-booking-source${searchQuery}`);
            const { data, totalRecords: count } = response.data;
            return { count, data };
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Add this type if not already present
export type BookingSourcePayload = Omit<IBookingSource, 'booking_source_uuid'>;

// Change the thunk signature
export const upsertBookingSourceAsync = createAsyncThunk<IBookingSource, { data: BookingSourcePayload, onCallback?: (isSuccess: boolean, data?: IBookingSource) => void }>(
    'formula/upsertBookingSourceAsync',
    async ({ data, onCallback }, thunkAPI) => {
        try {
            const response = await api.post('/formulas/upsert-booking-source', data);
            thunkAPI.dispatch(
                showMessage({
                    type: "success",
                    message: "Booking source saved successfully",
                    displayAs: "snackbar",
                })
            );
            if (onCallback) onCallback(true, response.data);
            return response.data;
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            if (onCallback) onCallback(false);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// New action to delete booking source
export const deleteBookingSourceAsync = createAsyncThunk<string, { uuid: string, onCallback?: (isSuccess: boolean) => void }>(
    'formula/deleteBookingSourceAsync',
    async ({ uuid, onCallback }, thunkAPI) => {
        try {
            await api.delete(`/formulas/delete-booking-source/${uuid}`);
            thunkAPI.dispatch(
                showMessage({
                    type: "success",
                    message: "Booking source deleted successfully",
                    displayAs: "snackbar",
                })
            );
            if (onCallback) onCallback(true);
            return uuid;
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            if (onCallback) onCallback(false);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// New action to fetch formula calculator logs
export const fetchFormulaCalculatorLogsAsync = createAsyncThunk<{ count: number, data: IFormulaCalculatorLog[] }, string>(
    'formula/fetchFormulaCalculatorLogsAsync',
    async (booking_source_uuid, thunkAPI) => {
        try {
            const response = await api.get(`/formulas/get-formula-calculator-log?booking_source_uuid=${booking_source_uuid}`);
            const { data, totalRecords: count } = response.data;
            return { count, data };
        } catch (error: any) {
            thunkAPI.dispatch(
                showMessage({
                    type: "error",
                    message: error.response?.data?.message || error.message,
                    displayAs: "snackbar",
                })
            );
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
