import { createAsyncThunk } from '@reduxjs/toolkit'
import axios_base_api, { axios_Loading_messages } from '@/api/axios-base-api'
import { server_base_endpoints } from '@/api'
import {
    closeLoadingDialog,
    openLoadingDialog,
    openSnackbarDialog,
} from '../loading-and-snackbar'
import { ISearchQueryParamsV2 } from '@/redux/store.types'
import { IVoucher } from './voucher.types'
import { getSearchQueryParamsV2 } from '@/redux/store.utils'

export const fetchVouchersAsync = createAsyncThunk<
    { count: number; data: IVoucher[] },
    ISearchQueryParamsV2
>(
    'voucher/fetchVouchersAsync',
    async (queryParams: ISearchQueryParamsV2, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams)

            const response = await axios_base_api.get(
                `${server_base_endpoints.vouchers.get_vouchers}${searchQuery}`,
            )

            return {
                count: response.data.currentRecords,
                data: response.data.data,
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    },
)

export const fetchSingleVoucherAsync = createAsyncThunk<IVoucher, string>(
    'voucher/fetchSingleVoucherAsync',
    async (voucher_uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(
                `${server_base_endpoints.vouchers.get_vouchers}?voucher_uuid=${voucher_uuid}`,
            )
            return response.data.data[0]
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    },
)

export const createVoucherAsync = createAsyncThunk<IVoucher, IVoucher>(
    'voucher/createVoucherAsync',
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        try {
            const response = await axios_base_api.post(
                server_base_endpoints.vouchers.create_voucher,
                payload,
            )
            thunkAPI.dispatch(
                openSnackbarDialog({
                    variant: 'success',
                    message: axios_Loading_messages.save_success,
                }),
            )
            return response.data.data
        } catch (error) {
            thunkAPI.dispatch(
                openSnackbarDialog({
                    variant: 'error',
                    message: axios_Loading_messages.save_error,
                }),
            )
            return thunkAPI.rejectWithValue(error)
        } finally {
            thunkAPI.dispatch(closeLoadingDialog())
        }
    },
)

export const updateVoucherAsync = createAsyncThunk<
    IVoucher,
    { payload: IVoucher; onSuccess?: (isSuccess: boolean) => void }
>('voucher/updateVoucherAsync', async ({ payload, onSuccess }, thunkAPI) => {
    thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))

    try {
        const response = await axios_base_api.post(
            server_base_endpoints.vouchers.update_voucher,
            {
                voucher_uuid: payload.voucher_uuid,
                voucher_code: payload.voucher_code,
                description: payload.description || '',
                label: payload.label,
                discount_type: payload.discount_type,
                amount: payload.amount,
                max_limit: payload.max_limit,
                status: payload.status,
            },
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

        return response.data.data
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
