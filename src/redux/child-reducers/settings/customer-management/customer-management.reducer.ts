import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";

import { defaultCustomerAutomationState } from "./customer-management.state";
import { fetchCustomerAutomationWithArgsAsync } from "./customer-management.actions";


const customerAutomationSlice = createSlice({
    initialState: defaultCustomerAutomationState,
    name: "customer-automation",
    reducers: {
        clearAutomationFullStateSync: (state) => {
            return defaultCustomerAutomationState
        },
        clearSingleAutomationStateSync: (state) => {
            state.single_automation.loading = defaultCustomerAutomationState.single_automation.loading
            state.single_automation.data = defaultCustomerAutomationState.single_automation.data
            state.single_automation.error = defaultCustomerAutomationState.single_automation.error
        },
    },
    extraReducers: (builder) => {
        // #################################### fetchCustomerAutomationWithArgsAsync ##############################################
        builder.addCase(fetchCustomerAutomationWithArgsAsync.pending, (state, action) => {
            state.single_automation.loading = ILoadState.pending
        })
        builder.addCase(fetchCustomerAutomationWithArgsAsync.fulfilled, (state, action) => {
            state.single_automation.loading = ILoadState.succeeded
            state.single_automation.data = action.payload
            state.single_automation.error = null
        })
        builder.addCase(fetchCustomerAutomationWithArgsAsync.rejected, (state, action) => {
            state.single_automation.error = action.error.message as string
        })
    },
});

export const customerAutomationReducer = customerAutomationSlice.reducer;
export const {
    clearAutomationFullStateSync,
    clearSingleAutomationStateSync
} = customerAutomationSlice.actions;
