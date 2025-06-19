import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";
import { fetchFilesAndFoldersFromS3BucketAsync, fetchRecordCountAsync, renameSingleFileWithCallbackAsync, renameSingleFolderWithCallbackAsync } from "./general.actions";
import { defaultGeneralState } from "./general.state";




const generalSlice = createSlice({
    initialState: defaultGeneralState,
    name: "general",
    reducers: {
        clearGeneralFullStateSync: (state) => {
            return defaultGeneralState
        },

        clearGeneralFilesAndFoldersListStateSync: (state) => {
            state.files_and_folders_list.loading = defaultGeneralState.files_and_folders_list.loading
            state.files_and_folders_list.data = defaultGeneralState.files_and_folders_list.data
            state.files_and_folders_list.error = defaultGeneralState.files_and_folders_list.error
        },
        clearRecordCountStateSync: (state) => {
            state.record_count.loading = defaultGeneralState.record_count.loading
            state.record_count.data = defaultGeneralState.record_count.data
            state.record_count.error = defaultGeneralState.record_count.error
        },


    },
    extraReducers: (builder) => {
        // ############################# fetchRecordCountAsync ######################################
        builder.addCase(fetchRecordCountAsync.pending, (state, action) => {
            state.record_count.loading = ILoadState.pending
        })
        builder.addCase(fetchRecordCountAsync.fulfilled, (state, action) => {
            state.record_count.loading = ILoadState.succeeded
            state.record_count.data = action.payload.data
            state.record_count.error = null
        })
        builder.addCase(fetchRecordCountAsync.rejected, (state, action) => {
            state.record_count.error = action.error.message as string
        })

        // ############################# fetchFilesAndFoldersFromS3BucketAsync ######################################
        builder.addCase(fetchFilesAndFoldersFromS3BucketAsync.pending, (state, action) => {
            state.files_and_folders_list.loading = ILoadState.pending
        })
        builder.addCase(fetchFilesAndFoldersFromS3BucketAsync.fulfilled, (state, action) => {
            state.files_and_folders_list.loading = ILoadState.succeeded
            state.files_and_folders_list.data = action.payload
            state.files_and_folders_list.error = null
        })
        builder.addCase(fetchFilesAndFoldersFromS3BucketAsync.rejected, (state, action) => {
            state.files_and_folders_list.error = action.error.message as string
        })


        // ############################# renameSingleFolderWithCallbackAsync ######################################
        builder.addCase(renameSingleFolderWithCallbackAsync.pending, (state, action) => {
            state.files_and_folders_list.loading = ILoadState.pending
        })
        builder.addCase(renameSingleFolderWithCallbackAsync.fulfilled, (state, action) => {
            console.log("renameSingleFolderWithCallbackAsync =>", action.payload)
            state.files_and_folders_list.loading = ILoadState.succeeded
            state.files_and_folders_list.data = action.payload
            state.files_and_folders_list.error = null
        })
        builder.addCase(renameSingleFolderWithCallbackAsync.rejected, (state, action) => {
            state.files_and_folders_list.error = action.error.message as string
        })

        // ############################# renameSingleFileWithCallbackAsync ######################################
        builder.addCase(renameSingleFileWithCallbackAsync.pending, (state, action) => {
            state.files_and_folders_list.loading = ILoadState.pending
        })
        builder.addCase(renameSingleFileWithCallbackAsync.fulfilled, (state, action) => {
            state.files_and_folders_list.loading = ILoadState.succeeded
            state.files_and_folders_list.data = action.payload
            state.files_and_folders_list.error = null
        })
        builder.addCase(renameSingleFileWithCallbackAsync.rejected, (state, action) => {
            state.files_and_folders_list.error = action.error.message as string
        })
    },
});

export const generalReducer = generalSlice.reducer;
export const {
    clearGeneralFilesAndFoldersListStateSync,
    clearGeneralFullStateSync,
    clearRecordCountStateSync
} = generalSlice.actions;
