import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";


import { defaultCompanyInformationState } from "./comapany-info.state";
import { ICompanyInformation } from "./comapany-info.types";
import { fetchComapanyInformationAsync } from "./comapany-info.actions";


const comapnyInformationSlice = createSlice({
    initialState: defaultCompanyInformationState,
    name: "comapnyInformation",
    reducers: {
        clearCompanyInformationStateSync: (state) => {
            return defaultCompanyInformationState
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchComapanyInformationAsync ######################################
        builder.addCase(fetchComapanyInformationAsync.pending, (state, action) => {
            state.loading = ILoadState.pending
        })
        builder.addCase(fetchComapanyInformationAsync.fulfilled, (state, action) => {
            state.loading = ILoadState.succeeded
            state.data = action.payload
            state.error = null
        })
        builder.addCase(fetchComapanyInformationAsync.rejected, (state, action) => {
            state.error = action.error.message as string
        })
    },
});

export const comapnyInformationReducer = comapnyInformationSlice.reducer;
export const {
    clearCompanyInformationStateSync,
} = comapnyInformationSlice.actions;
