import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "@//redux/store.enums";
import { defaultDocumentState } from "./documents.state";
import { fetchMultipleDocumentForLeadsAsync, fetchMultipleDocumentsAsync } from "./documents.actions";


const documentsSlice = createSlice({
    initialState: defaultDocumentState,
    name: "documents",
    reducers: {
        clearMultipleDocumentStateSync: (state) => {
            state.multiple_documents_list.loading = defaultDocumentState.multiple_documents_list.loading
            state.multiple_documents_list.data = defaultDocumentState.multiple_documents_list.data
            state.multiple_documents_list.error = defaultDocumentState.multiple_documents_list.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleDocumentsAsync ######################################
        builder.addCase(fetchMultipleDocumentsAsync.pending, (state, action) => {
            state.multiple_documents_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleDocumentsAsync.fulfilled, (state, action) => {
            state.multiple_documents_list.loading = ILoadState.succeeded
            state.multiple_documents_list.data = action.payload.data
            state.multiple_documents_list.count = action.payload.count
            state.multiple_documents_list.error = null
        })
        builder.addCase(fetchMultipleDocumentsAsync.rejected, (state, action) => {
            state.multiple_documents_list.error = action.error.message as string
        })

        // ############################# fetchMultipleDocumentForLeadsAsync ######################################
        builder.addCase(fetchMultipleDocumentForLeadsAsync.pending, (state, action) => {
            state.multiple_documents_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleDocumentForLeadsAsync.fulfilled, (state, action) => {
            state.multiple_documents_list.loading = ILoadState.succeeded
            state.multiple_documents_list.data = action.payload.data
            state.multiple_documents_list.count = action.payload.count
            state.multiple_documents_list.error = null
        })
        builder.addCase(fetchMultipleDocumentForLeadsAsync.rejected, (state, action) => {
            state.multiple_documents_list.error = action.error.message as string
        })

    },
});

export const documentsReducer = documentsSlice.reducer;
export const {
    clearMultipleDocumentStateSync,
} = documentsSlice.actions;
