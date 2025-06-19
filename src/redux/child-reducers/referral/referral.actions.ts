import { createAsyncThunk } from '@reduxjs/toolkit'
import axios_base_api, { axios_Loading_messages } from '@/api/axios-base-api'
import { server_base_endpoints } from '@/api'
import {
    closeLoadingDialog,
    openLoadingDialog,
    openSnackbarDialog,
} from '../loading-and-snackbar'
import { ISearchQueryParamsV2 } from '@/redux/store.types'
import { IReferral } from './referral.types'
import { getSearchQueryParamsV2 } from '@/redux/store.utils'

export const fetchReferralsAsync = createAsyncThunk<
    { count: number; data: IReferral[] },
    ISearchQueryParamsV2
>(
    'referral/fetchReferralsAsync',
    async (queryParams: ISearchQueryParamsV2, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams)
            const response = await axios_base_api.get(
                `${server_base_endpoints.data_management.get_referral}${searchQuery}`,
            )
            return {
                count:
                    response.data.totalRecords || response.data.currentRecords, // Use totalRecords if available, fallback to currentRecords
                data: response.data.data,
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    },
)

export const fetchSingleReferralAsync = createAsyncThunk<IReferral, string>(
    'referral/fetchSingleReferralAsync',
    async (bni_clicks_uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(
                `${server_base_endpoints.data_management.get_referral}?bni_clicks_uuid=${bni_clicks_uuid}`,
            )
            return response.data.data[0]
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    },
)

export const updateReferralAsync = createAsyncThunk<
    boolean,
    { payload: Partial<IReferral>; onSuccess?: (isSuccess: boolean) => void }
>('referral/updateReferralAsync', async ({ payload, onSuccess }, thunkAPI) => {
    thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))

    try {
        // Exclude create_ts from payload
        const { create_ts, ...cleanPayload } = payload

        const response = await axios_base_api.post(
            `${server_base_endpoints.data_management.upsert_referral}`,
            cleanPayload,
        )

        thunkAPI.dispatch(
            openSnackbarDialog({
                variant: 'success',
                message: axios_Loading_messages.save_success,
            }),
        )

        if (onSuccess) {
            onSuccess(true)
        }

        return response.data.success
    } catch (error) {
        thunkAPI.dispatch(
            openSnackbarDialog({
                variant: 'error',
                message: axios_Loading_messages.save_error,
            }),
        )

        if (onSuccess) {
            onSuccess(false)
        }

        return thunkAPI.rejectWithValue(error)
    } finally {
        thunkAPI.dispatch(closeLoadingDialog())
    }
})
