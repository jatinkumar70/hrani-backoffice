import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";
import { defaultUserProfileState } from "./user-profile.state";
import { fetchMultipleUsersWithArgsAsync, fetchSingleUserProfileWithArgsAsync } from "./user-profile.actions";



const userProfileSlice = createSlice({
    initialState: defaultUserProfileState,
    name: "user-profiles",
    reducers: {
        clearUserProfileFullStateSync: (state) => {
            return defaultUserProfileState
        },
        clearSingleUserProfileStateSync: (state) => {
            state.single_user_profile.loading = defaultUserProfileState.single_user_profile.loading
            state.single_user_profile.data = defaultUserProfileState.single_user_profile.data
            state.single_user_profile.error = defaultUserProfileState.single_user_profile.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleUsersWithArgsAsync ######################################
        builder.addCase(fetchMultipleUsersWithArgsAsync.pending, (state, action) => {
            state.user_profile_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleUsersWithArgsAsync.fulfilled, (state, action) => {
            state.user_profile_list.loading = ILoadState.succeeded
            state.user_profile_list.data = action.payload.data
            state.user_profile_list.count = action.payload.count
            state.user_profile_list.error = null
        })
        builder.addCase(fetchMultipleUsersWithArgsAsync.rejected, (state, action) => {
            state.user_profile_list.error = action.error.message as string
        })



        // #################################### fetchSingleUserProfileWithArgsAsync ##############################################

        builder.addCase(fetchSingleUserProfileWithArgsAsync.pending, (state, action) => {
            state.single_user_profile.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleUserProfileWithArgsAsync.fulfilled, (state, action) => {
            state.single_user_profile.loading = ILoadState.succeeded
            state.single_user_profile.data = action.payload
            state.single_user_profile.error = null
        })
        builder.addCase(fetchSingleUserProfileWithArgsAsync.rejected, (state, action) => {
            state.single_user_profile.error = action.error.message as string
        })
    },
});

export const userProfileReducer = userProfileSlice.reducer;
export const {
    clearUserProfileFullStateSync,
    clearSingleUserProfileStateSync
} = userProfileSlice.actions;
