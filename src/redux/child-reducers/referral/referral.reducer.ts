import { createSlice } from '@reduxjs/toolkit'
import { defaultReferralState } from './referral.state'
import {
    fetchReferralsAsync,
    fetchSingleReferralAsync,
} from './referral.actions'
import { ILoadState } from '@/redux/store.enums'

const referralSlice = createSlice({
    initialState: defaultReferralState,
    name: 'referral',
    reducers: {
        clearReferralListState: (state) => {
            state.referral_list = defaultReferralState.referral_list
        },
        clearSingleReferralState: (state) => {
            state.single_referral = defaultReferralState.single_referral
        },
    },
    extraReducers: (builder) => {
        // Fetch Referrals
        builder.addCase(fetchReferralsAsync.pending, (state) => {
            state.referral_list.loading = ILoadState.pending
        })
        builder.addCase(fetchReferralsAsync.fulfilled, (state, action) => {
            state.referral_list.loading = ILoadState.succeeded
            state.referral_list.data = action.payload.data
            state.referral_list.count = action.payload.count
            state.referral_list.error = null
        })
        builder.addCase(fetchReferralsAsync.rejected, (state, action) => {
            state.referral_list.loading = ILoadState.failed
            state.referral_list.error =
                action.error.message || 'Failed to fetch referrals'
        })

        // Fetch Single Referral
        builder.addCase(fetchSingleReferralAsync.pending, (state) => {
            state.single_referral.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleReferralAsync.fulfilled, (state, action) => {
            state.single_referral.loading = ILoadState.succeeded
            state.single_referral.data = action.payload
            state.single_referral.error = null
        })
        builder.addCase(fetchSingleReferralAsync.rejected, (state, action) => {
            state.single_referral.loading = ILoadState.failed
            state.single_referral.error =
                action.error.message || 'Failed to fetch referral'
        })
    },
})

export const referralReducer = referralSlice.reducer
export const { clearReferralListState, clearSingleReferralState } =
    referralSlice.actions
