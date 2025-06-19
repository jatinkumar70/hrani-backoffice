import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";

import { defaultCommentState } from "./comments.state";
import { fetchMultipleCommentsWithArgsAsync } from "./comments.actions";


const commentSlice = createSlice({
    initialState: defaultCommentState,
    name: "comments",
    reducers: {
        clearCommentFullStateSync: (state) => {
            return defaultCommentState
        },
        clearSingleCommentStateSync: (state) => {
            state.single_comment.loading = defaultCommentState.single_comment.loading
            state.single_comment.data = defaultCommentState.single_comment.data
            state.single_comment.error = defaultCommentState.single_comment.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultiplePrivateLeadsWithArgsAsync ######################################
        builder.addCase(fetchMultipleCommentsWithArgsAsync.pending, (state, action) => {
            state.all_comments.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleCommentsWithArgsAsync.fulfilled, (state, action) => {
            state.all_comments.loading = ILoadState.succeeded
            state.all_comments.data = action.payload.data
            state.all_comments.count = action.payload.count
            state.all_comments.error = null
        })
        builder.addCase(fetchMultipleCommentsWithArgsAsync.rejected, (state, action) => {
            state.all_comments.error = action.error.message as string
        })



        // #################################### fetchSinglePrivateLeadWithArgsAsync ##############################################

        // builder.addCase(fetchSinglePrivateLeadWithArgsAsync.pending, (state, action) => {
        //     state.single_private_lead.loading = ILoadState.pending
        // })
        // builder.addCase(fetchSinglePrivateLeadWithArgsAsync.fulfilled, (state, action) => {
        //     state.single_private_lead.loading = ILoadState.succeeded
        //     state.single_private_lead.data = action.payload
        //     state.single_private_lead.error = null
        // })
        // builder.addCase(fetchSinglePrivateLeadWithArgsAsync.rejected, (state, action) => {
        //     state.single_private_lead.error = action.error.message as string
        // })
    },
});

export const commentsReducer = commentSlice.reducer;
export const {
    clearCommentFullStateSync,
    clearSingleCommentStateSync
} = commentSlice.actions;
