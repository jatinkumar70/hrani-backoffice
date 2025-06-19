import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";

import { fetchMultipleBranchesWithArgsAsync, fetchSingleBranchWithArgsAsync } from "./branch.actions";
import { defaultBranchState } from "./branch.state";



const branchSlice = createSlice({
    initialState: defaultBranchState,
    name: "branch",
    reducers: {
        clearBranchFullStateSync: (state) => {
            return defaultBranchState
        },
        clearBranchListStateSync: (state) => {
            state.multiple_branches.loading = defaultBranchState.multiple_branches.loading
            state.multiple_branches.data = defaultBranchState.multiple_branches.data
            state.multiple_branches.error = defaultBranchState.multiple_branches.error
        },
        clearSingleBranchStateSync: (state) => {
            state.single_branch.loading = defaultBranchState.single_branch.loading
            state.single_branch.data = defaultBranchState.single_branch.data
            state.single_branch.error = defaultBranchState.single_branch.error
        },

    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleBranchesWithArgsAsync ######################################
        builder.addCase(fetchMultipleBranchesWithArgsAsync.pending, (state, action) => {
            state.multiple_branches.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleBranchesWithArgsAsync.fulfilled, (state, action) => {
            state.multiple_branches.loading = ILoadState.succeeded
            state.multiple_branches.data = action.payload.data
            state.multiple_branches.count = action.payload.count
            state.multiple_branches.error = null
        })
        builder.addCase(fetchMultipleBranchesWithArgsAsync.rejected, (state, action) => {
            state.multiple_branches.error = action.error.message as string
        })
        // #################################### fetchSingleBranchWithArgsAsync ##############################################
        builder.addCase(fetchSingleBranchWithArgsAsync.pending, (state, action) => {
            state.single_branch.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleBranchWithArgsAsync.fulfilled, (state, action) => {
            state.single_branch.loading = ILoadState.succeeded
            state.single_branch.data = action.payload
            state.single_branch.error = null
        })
        builder.addCase(fetchSingleBranchWithArgsAsync.rejected, (state, action) => {
            state.single_branch.error = action.error.message as string
        })


    },
});

export const branchReducer = branchSlice.reducer;
export const {
    clearBranchFullStateSync,
    clearBranchListStateSync,
    clearSingleBranchStateSync
} = branchSlice.actions;
