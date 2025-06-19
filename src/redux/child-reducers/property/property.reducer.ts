import { createSlice } from "@reduxjs/toolkit";
import { ILoadState } from "@/redux/store.enums";
import { defaultPropertyState } from "./property.state";
import {
    fetchMultiplePropertiesWithArgsAsync,
    fetchSinglePropertyWithArgsAsync,
    createPropertyWithCallbackAsync,
    upsertPropertyWithCallbackAsync
} from "./property.actions";

const propertySlice = createSlice({
    initialState: defaultPropertyState,
    name: "property",
    reducers: {
        clearPropertyFullStateSync: (state) => {
            return defaultPropertyState
        },
        clearSinglePropertyStateSync: (state) => {
            state.single_property.loading = defaultPropertyState.single_property.loading
            state.single_property.data = defaultPropertyState.single_property.data
            state.single_property.error = defaultPropertyState.single_property.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultiplePropertiesWithArgsAsync ######################################
        builder.addCase(fetchMultiplePropertiesWithArgsAsync.pending, (state) => {
            state.property_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultiplePropertiesWithArgsAsync.fulfilled, (state, action) => {
            state.property_list.loading = ILoadState.succeeded
            state.property_list.data = action.payload.data
            state.property_list.count = action.payload.count
            state.property_list.error = null
        })
        builder.addCase(fetchMultiplePropertiesWithArgsAsync.rejected, (state, action) => {
            state.property_list.error = action.error.message as string
        })

        // #################################### fetchSinglePropertyWithArgsAsync ##############################################
        builder.addCase(fetchSinglePropertyWithArgsAsync.pending, (state) => {
            state.single_property.loading = ILoadState.pending
        })
        builder.addCase(fetchSinglePropertyWithArgsAsync.fulfilled, (state, action) => {
            state.single_property.loading = ILoadState.succeeded
            state.single_property.data = action.payload
            state.single_property.error = null
        })
        builder.addCase(fetchSinglePropertyWithArgsAsync.rejected, (state, action) => {
            state.single_property.error = action.error.message as string
        })

        // #################################### createPropertyWithCallbackAsync ##############################################
        builder.addCase(createPropertyWithCallbackAsync.pending, (state) => {
            state.single_property.loading = ILoadState.pending
        })
        builder.addCase(createPropertyWithCallbackAsync.fulfilled, (state, action) => {
            state.single_property.loading = ILoadState.succeeded
            state.single_property.data = action.payload
            state.single_property.error = null
        })
        builder.addCase(createPropertyWithCallbackAsync.rejected, (state, action) => {
            state.single_property.error = action.error.message as string
        })

        // #################################### upsertPropertyWithCallbackAsync ##############################################
        builder.addCase(upsertPropertyWithCallbackAsync.pending, (state) => {
            state.single_property.loading = ILoadState.pending
        })
        builder.addCase(upsertPropertyWithCallbackAsync.fulfilled, (state, action) => {
            state.single_property.loading = ILoadState.succeeded
            state.single_property.data = action.payload
            state.single_property.error = null
        })
        builder.addCase(upsertPropertyWithCallbackAsync.rejected, (state, action) => {
            state.single_property.error = action.error.message as string
        })
    },
});

export const propertyReducer = propertySlice.reducer;
export const {
    clearPropertyFullStateSync,
    clearSinglePropertyStateSync
} = propertySlice.actions; 