import { createSlice } from '@reduxjs/toolkit'
import { defaultVoucherState } from './voucher.state'
import {
    fetchVouchersAsync,
    fetchSingleVoucherAsync,
    createVoucherAsync,
} from './voucher.actions'
import { ILoadState } from '@/redux/store.enums'

const voucherSlice = createSlice({
    initialState: defaultVoucherState,
    name: 'voucher',
    reducers: {
        clearVoucherListState: (state) => {
            state.voucher_list = defaultVoucherState.voucher_list
        },
        clearSingleVoucherState: (state) => {
            state.single_voucher = defaultVoucherState.single_voucher
        },
    },
    extraReducers: (builder) => {
        // Fetch Vouchers
        builder.addCase(fetchVouchersAsync.pending, (state) => {
            state.voucher_list.loading = ILoadState.pending
        })
        builder.addCase(fetchVouchersAsync.fulfilled, (state, action) => {
            state.voucher_list.loading = ILoadState.succeeded
            state.voucher_list.data = action.payload.data
            state.voucher_list.count = action.payload.count
            state.voucher_list.error = null
        })
        builder.addCase(fetchVouchersAsync.rejected, (state, action) => {
            state.voucher_list.loading = ILoadState.failed
            state.voucher_list.error =
                action.error.message || 'Failed to fetch vouchers'
        })

        // Fetch Single Voucher
        builder.addCase(fetchSingleVoucherAsync.pending, (state) => {
            state.single_voucher.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleVoucherAsync.fulfilled, (state, action) => {
            state.single_voucher.loading = ILoadState.succeeded
            state.single_voucher.data = action.payload
            state.single_voucher.error = null
        })
        builder.addCase(fetchSingleVoucherAsync.rejected, (state, action) => {
            state.single_voucher.loading = ILoadState.failed
            state.single_voucher.error =
                action.error.message || 'Failed to fetch voucher'
        })

        // Create Voucher
        builder.addCase(createVoucherAsync.pending, (state) => {
            state.single_voucher.loading = ILoadState.pending
        })
        builder.addCase(createVoucherAsync.fulfilled, (state, action) => {
            state.single_voucher.loading = ILoadState.succeeded
            state.single_voucher.data = action.payload
            state.single_voucher.error = null
            state.voucher_list.data.unshift(action.payload)
            state.voucher_list.count += 1
        })
        builder.addCase(createVoucherAsync.rejected, (state, action) => {
            state.single_voucher.loading = ILoadState.failed
            state.single_voucher.error =
                action.error.message || 'Failed to create voucher'
        })
    },
})

export const voucherReducer = voucherSlice.reducer
export const { clearVoucherListState, clearSingleVoucherState } =
    voucherSlice.actions
