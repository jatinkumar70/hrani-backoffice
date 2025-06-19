import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";
import { defaultServiceState } from "./services.state";
import { fetchMultipleServicesWithArgsAsync, fetchSingleServiceWithArgsAsync } from "./services.actions";




const servicesSlice = createSlice({
    initialState: defaultServiceState,
    name: "services",
    reducers: {
        clearServicesFullStateSync: (state) => {
            return defaultServiceState
        },
        clearServicesListStateSync: (state) => {
            state.services_list.loading = defaultServiceState.services_list.loading
            state.services_list.data = defaultServiceState.services_list.data
            state.services_list.error = defaultServiceState.services_list.error
        },
        clearSingleServiceStateSync: (state) => {
            state.single_service.loading = defaultServiceState.single_service.loading
            state.single_service.data = defaultServiceState.single_service.data
            state.single_service.error = defaultServiceState.single_service.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleServicesWithArgsAsync ######################################
        builder.addCase(fetchMultipleServicesWithArgsAsync.pending, (state, action) => {
            state.services_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleServicesWithArgsAsync.fulfilled, (state, action) => {
            state.services_list.loading = ILoadState.succeeded
            state.services_list.data = action.payload.data
            state.services_list.count = action.payload.count
            state.services_list.error = null
        })
        builder.addCase(fetchMultipleServicesWithArgsAsync.rejected, (state, action) => {
            state.services_list.error = action.error.message as string
        })
        // #################################### fetchSingleServiceWithArgsAsync ##############################################
        builder.addCase(fetchSingleServiceWithArgsAsync.pending, (state, action) => {
            state.single_service.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleServiceWithArgsAsync.fulfilled, (state, action) => {
            state.single_service.loading = ILoadState.succeeded
            state.single_service.data = action.payload
            state.single_service.error = null
        })
        builder.addCase(fetchSingleServiceWithArgsAsync.rejected, (state, action) => {
            state.single_service.error = action.error.message as string
        })
    },
});

export const servicesReducer = servicesSlice.reducer;
export const {
    clearServicesFullStateSync,
    clearServicesListStateSync,
    clearSingleServiceStateSync
} = servicesSlice.actions;
